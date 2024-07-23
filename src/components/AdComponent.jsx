import React from 'react';
import videoSrc from './video-1.mp4'; 

const AdComponent = () => {
    return (
        <div className="ad-container">
            {/* Your ad or video component here */}
            <p>Loading... Please wait.</p>
            {/* Example: Video ad */}
            <video width="100%" controls>
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default AdComponent;
