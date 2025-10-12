import React, { Fragment, useEffect, useState } from "react";
import { createApi } from "unsplash-js";

const unsplash = createApi({
    accessKey: import.meta.env.VITE_UNSPLASH_API_KEY,
});

const PhotoComp = ({ photo }) => {
    const { user, urls } = photo;

    return (
        <Fragment>
            <figure className={"flex flex-col h-full w-full overflow-hidden"}>
                    <img
                        src={urls.regular}
                        alt={`Photo by ${user?.username || "photographer"} on Unsplash`}
                        className="block h-full w-full object-cover"
                    />
                <figcaption className="px-4 py-3 text-center font-light text-[10px] text-white/70 text-shadow-xs text-shadow-neutral-500/20 tracking-wide">
                    (Photo by{" "}
                    <a className="text-text-secondary hover:text-warning" target="_blank" href={`https://unsplash.com/@${user.username}?utm_source=travel_mate&utm_medium=referral`}>
                        {user.username}
                    </a>{" "}
                    on{" "}
                    <a className="text-text-secondary hover:text-warning" target="_blank" href="https://unsplash.com?utm_source=travel_mate&utm_medium=referral">
                        Unsplash
                    </a>
                    )
            </figcaption>
            </figure>
        </Fragment>
    );
};

const UnsplashComponent = () => {
  const [data, setPhotoResponse] = useState(null);

    useEffect(() => {
        unsplash.photos
            .getRandom({ query: 'travel, city, airplane, adventure, vacation, skyline', orientation: 'portrait', count: 1})
            .then((result) => {
                setPhotoResponse(result);
            })
            .catch(() => {
                console.error('Something went wrong!');
            });
    }, []);

    if (data === null) {
        return <div className={"rounded-md bg-muted animate-pulse max-w-xl min-h-screen"}></div>;
    } else if (data.errors) {
        return (
            <div>
                <div>{data.errors[0]}</div>
                <div>PS: Make sure to set your access token!</div>
            </div>
        );
    } else {
        return (
          <div className={"h-full w-full"}>
              <PhotoComp photo={data.response[0]} />
          </div>
        );
    }
};

export default UnsplashComponent;