import React from 'react'
import { ThreeDots } from 'react-loader-spinner'

const Loader = ({text}) => {
    return (
        <div
            style={{
                // position: 'absolute',
                // top: '50%',
                // left: '50%',
                // transform: 'translate(-50%, -50%)',
                backgroundColor: "#0C0D0F", /* Adjust the transparency by changing the last value (0.5) */
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                zIndex: 9999, // Ensure the loader appears above other content
            }}
        >
            <ThreeDots
                height={80}
                width={80}
                color="#4fa94d"
                secondaryColor="#4fa94d"
                strokeWidth={4}
                strokeWidthSecondary={2}
            />
            <div style={{ marginTop: '5px', color: 'white' }}>
                {text}
            </div>
        </div>
    );
};

export default Loader