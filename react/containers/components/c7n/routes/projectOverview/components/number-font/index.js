import React from 'react';
import './index.less';
function isNumber(value) {
    if (value === "" || value === null) {
        return false;
    }
    if (!isNaN(value)) {
        return true;
    }
    return false;

}
function numberFactory(number) {
    return <svg  width="14px" height="37px" viewBox="0 0 14 24" version="1.1" xmlns="http://www.w3.org/2000/svg" >
        <g id="number-0" stroke="none"  strokeWidth="1" fill="none" fillRule="evenodd" fontFamily="DINAlternate-Bold, DIN Alternate" fontSize="32" fontWeight="bold">
            <text id="number" fill="#3A345F">
                <tspan x="-1" y='23'>{number}</tspan>
            </text>
        </g>
    </svg>
}
export default function normalToSvg(content) {
    if (!isNumber(content)) {
        return '';
    }
return <div className="c7n-project-overview-svg">{`${content}`.split('').map(i => numberFactory(i))}</div>;
}