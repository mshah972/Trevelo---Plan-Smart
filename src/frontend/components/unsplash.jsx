import React, { Fragment, useEffect, useState } from "react";
import { createApi } from "unsplash-js";

const unsplash = createApi({
    accessKey: import.meta.env.VITE_UNSPLASH_API_KEY,
});

const PhotoComp = ({ photo }) => {
    const { user, urls } = photo;

    return (
        <Fragment>
            <div className={"flex flex-col gap-2"}>
                <a href={`${urls.regular}`} target={"_blank"}><img className={"img rounded-4xl max-w-2xl h-[900px] object-cover"} src={urls.regular} /></a>
                <p className={"font-light text-xs"}>(Photo by <a className={"credit"} target={"_blank"} href={`https://unsplash.com/@${user.username}`}>{user.username}</a> on <a className={"credit"} target={"_blank"} href={"https://unsplash.com"}>Unsplash</a>)</p>
            </div>
        </Fragment>
    );
};

const UnsplashComponent = () => {
  const [data, setPhotoResponse] = useState(null);

    useEffect(() => {
        unsplash.photos
            .getRandom({ query: 'Travel', orientation: 'portrait', count: 1})
            .then((result) => {
                setPhotoResponse(result);
            })
            .catch(() => {
                console.error('Something went wrong!');
            });
    }, []);

    if (data === null) {
        return <div className={"rounded-4xl bg-neutral-700 animate-pulse min-w-3xl min-h-screen"}></div>;
    } else if (data.errors) {
        return (
            <div>
                <div>{data.errors[0]}</div>
                <div>PS: Make sure to set your access token!</div>
            </div>
        );
    } else {
        return (
          <div className={"photo"}>
              <PhotoComp photo={data.response[0]} />
          </div>
        );
    }
};

export default UnsplashComponent;