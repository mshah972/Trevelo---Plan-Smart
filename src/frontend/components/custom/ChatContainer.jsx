import {cn} from "../../utils/utils.js";
import {useState, useEffect, Fragment, useRef, useCallback} from 'react';

const renderJSXWithTypingEffect = (content, isVisible) => {
    if (!isVisible) return null;
    if (typeof content === 'string') return content;
    return content;
};

const useAutoScroll = (containerRef, enabled) => {
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const lastScrollTopRef = useRef(0);
    const autoScrollingRef = useRef(false);
    const prevChildrenCountRef = useRef(0);

    const isAtBottom = useCallback((element) => {
        const {scrollTop, scrollHeight, clientHeight} = element;
        return scrollHeight - scrollTop - clientHeight <= 20;
    }, []);

    const scrollToBottom = useCallback(
        (behavior = 'smooth') => {
            const container = containerRef.current;
            if (!container) return;

            autoScrollingRef.current = true;

            const targetScrollTop = container.scrollHeight;
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

            container.scrollTo({
                top: targetScrollTop,
                behavior: isIOS ? 'auto' : behavior,
            });

            if (isIOS) {
                setTimeout(() => {
                    container.scrollTop = targetScrollTop;
                    autoScrollingRef.current = false;
                }, 100);
            } else {
                const checkScrollEnd = () => {
                    if (Math.abs(container.scrollTop - targetScrollTop) < 5) {
                        autoScrollingRef.current = false;
                        return;
                    }
                    requestAnimationFrame(checkScrollEnd);
                };
                requestAnimationFrame(checkScrollEnd);
            }

            const safetyTimeout = setTimeout(() => {
                autoScrollingRef.current = false;
            }, 500);

            return () => clearTimeout(safetyTimeout);
        },
        [containerRef]
    );

    useEffect(() => {
        if (!enabled) return;
        const container = containerRef?.current;
        if (!container) return;

        lastScrollTopRef.current = container.scrollTop;

        const handleScroll = () => {
            if (autoScrollingRef.current) return;
            const currentScrollTop = container.scrollTop;
            if (currentScrollTop < lastScrollTopRef.current && autoScrollEnabled) {
                setAutoScrollEnabled(false);
            }
            if (isAtBottom(container) && !autoScrollEnabled) {
                setAutoScrollEnabled(true);
            }
            lastScrollTopRef.current = currentScrollTop;
        };

        container.addEventListener('scroll', handleScroll, {passive: true});
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [containerRef, enabled, autoScrollEnabled, isAtBottom]);

    return {
        autoScrollEnabled,
        scrollToBottom,
        prevChildrenCountRef,
    };
};

export const ChatContainer = ({messages, containerRef}) => {
    const [typingTexts, setTypingTexts] = useState([]);
    const [visibleJSX, setVisibleJSX] = useState([]);
    const [activeMessages, setActiveMessages] = useState([]);
    const [showThinking, setShowThinking] = useState(false);
    const lastMessageRef = useRef(null);
    const processedMessagesRef = useRef(new Set());

    const {
        autoScrollEnabled,
        scrollToBottom,
        prevChildrenCountRef,
    } = useAutoScroll(containerRef, true);

    useEffect(() => {
        if (messages.length > prevChildrenCountRef.current) {
            scrollToBottom("smooth");
        }
        prevChildrenCountRef.current = messages.length;
    }, [messages, scrollToBottom]);

    useEffect(() => {
        const processMessage = (messageIndex) => {
            const assistantMessages = messages.filter(msg => msg.role === 'assistant');
            if (messageIndex >= assistantMessages.length) {
                scrollToBottom("smooth");
                return;
            }
            const message = assistantMessages[messageIndex];
            const actualMessageIndex = messages.findIndex(
                (m, i) => m.role === 'assistant' &&
                    messages.filter((msg, j) => msg.role === 'assistant' && j < i).length === messageIndex
            );
            if (processedMessagesRef.current.has(message.id)) {
                processMessage(messageIndex + 1);
                return;
            }
            setActiveMessages(prev => [...prev, actualMessageIndex]);
            if (typeof message.content === 'string') {
                let currentCharIndex = 0;
                const content = message.content;
                const intervalId = setInterval(() => {
                    if (currentCharIndex < content.length) {
                        setTypingTexts((prev) => {
                            const newTexts = [...prev];
                            newTexts[messageIndex] = content.substring(0, currentCharIndex + 1);
                            return newTexts;
                        });
                        currentCharIndex++;
                        requestAnimationFrame(() => {
                            if (containerRef.current && autoScrollEnabled) {
                                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                                scrollToBottom(isIOS ? 'auto' : 'smooth');
                            }
                        });
                    } else {
                        clearInterval(intervalId);
                        processedMessagesRef.current.add(message.id);
                        setTimeout(() => {
                            processMessage(messageIndex + 1);
                            scrollToBottom("smooth");
                        }, 500);
                    }
                }, 10);

                return () => clearInterval(intervalId);
            } else if (message.content) {
                setVisibleJSX(prev => {
                    const newVisible = [...prev];
                    newVisible[messageIndex] = false;
                    return newVisible;
                });
                setTimeout(() => {
                    setVisibleJSX(prev => {
                        const newVisible = [...prev];
                        newVisible[messageIndex] = true;
                        return newVisible;
                    });
                    processedMessagesRef.current.add(message.id);
                    setTimeout(() => {
                        processMessage(messageIndex + 1);
                        scrollToBottom("smooth");
                    }, 200);
                }, 100);
            }
        };

        // Reset states for new messages only
        const assistantMessages = messages.filter(msg => msg.role === 'assistant');
        const unprocessedAssistantMessages = assistantMessages.filter(msg => !processedMessagesRef.current.has(msg.id));

        if (unprocessedAssistantMessages.length > 0) {
            setTypingTexts(prev => {
                const newTexts = [...prev];
                unprocessedAssistantMessages.forEach((_, index) => {
                    const totalIndex = assistantMessages.length - unprocessedAssistantMessages.length + index;
                    newTexts[totalIndex] = '';
                });
                return newTexts;
            });

            setVisibleJSX(prev => {
                const newVisible = [...prev];
                unprocessedAssistantMessages.forEach((_, index) => {
                    const totalIndex = assistantMessages.length - unprocessedAssistantMessages.length + index;
                    newVisible[totalIndex] = false;
                });
                return newVisible;
            });
        }

        setActiveMessages(prev => {
            const newActiveMessages = [...prev];
            messages.forEach((msg, index) => {
                if (msg.role === 'user' && !newActiveMessages.includes(index)) {
                    newActiveMessages.push(index);
                    requestAnimationFrame(() => {
                        if (containerRef.current && autoScrollEnabled) {
                            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                            scrollToBottom(isIOS ? 'auto' : 'smooth');
                        }
                    });
                }
            });
            return newActiveMessages;
        });

        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'user') {
            setShowThinking(true);

            setTimeout(() => {
                setShowThinking(false);
                const firstUnprocessedIndex = assistantMessages.findIndex(m => !processedMessagesRef.current.has(m.id));
                if (firstUnprocessedIndex !== -1) {
                    processMessage(firstUnprocessedIndex);
                }
            }, 2000);
        } else {
            const firstUnprocessedIndex = assistantMessages.findIndex(m => !processedMessagesRef.current.has(m.id));
            if (firstUnprocessedIndex !== -1) {
                processMessage(firstUnprocessedIndex);
            }
        }
    }, [messages]);

    return (
        <div
            ref={containerRef}
            className={cn(
                `flex flex-col ${messages?.length > 0 ? 'h-full' : ''} gap-7 w-full`
            )}
        >
            {messages.map((message, index) => {
                const assistantIndex = messages.filter(
                    (m, i) => m.role === 'assistant' && i < index
                ).length;
                if (!activeMessages.includes(index)) return null;
                return (
                    <div
                        key={index}
                        ref={index === messages.length - 1 ? lastMessageRef : null}
                        className={cn(
                            'flex w-full',
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        <div
                            className={cn(
                                index === 0 && 'mt-4',
                                message.role === 'user' ? 'sm:w-full md:w-[420px]' : 'w-full',
                                message.role === 'user' ? 'px-4 py-2' : 'px-0 py-0',
                                'rounded-2xl',
                                'text-foreground/70',
                                message.role === 'user' ? 'bg-bubble' : 'bg-layout'
                            )}
                        >
                            {message.role === 'assistant' ? (
                                typeof message.content === 'string' ? (
                                    <Fragment key={`typing-${index}`}>
                                        {typingTexts[assistantIndex] || ''}
                                        {typingTexts[assistantIndex] &&
                                            typingTexts[assistantIndex].length <
                                            message.content.length && (
                                                <span className="animate-pulse">▋</span>
                                            )}
                                    </Fragment>
                                ) : (
                                    <div
                                        className={`transition-opacity duration-500 ${
                                            visibleJSX[assistantIndex] ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        {renderJSXWithTypingEffect(
                                            message.content,
                                            visibleJSX[assistantIndex]
                                        )}
                                        {!visibleJSX[assistantIndex] && (
                                            <span className="animate-pulse">▋</span>
                                        )}
                                    </div>
                                )
                            ) : (
                                <p className='text-foreground/70 text-sm'>{message.content}</p>
                            )}
                        </div>
                    </div>
                );
            })}

            {showThinking && (
                <div className="flex w-full justify-start">
                    <div className="rounded-2xl px-4 py-2 bg-layout text-foreground/70">
                        <div className="flex items-center gap-2">
                            <span className="text-xs italic">Thinking...</span>
                            <span className="flex">
                                <span className="animate-bounce delay-0">.</span>
                                <span className="animate-bounce delay-100">.</span>
                                <span className="animate-bounce delay-200">.</span>
                              </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
