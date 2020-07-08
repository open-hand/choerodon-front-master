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
    let x = Number(number);
    if (x <= 1) {
        x = -1 - 1;
    } else if (x === 3 || x === 4 || x === 8) {
        x = 0;
    } else {
        x = -1
    }
    return <svg  width="14px" height="37px" viewBox="0 0 14 24" version="1.1" xmlns="http://www.w3.org/2000/svg" >
        <g id="number-0" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" font-family="DINAlternate-Bold, DIN Alternate" font-size="32" font-weight="bold">
            <text id="number" fill="#3A345F">
                <tspan x="-1" y={Number(number) !== 6 ? '23' : '24'}>{number}</tspan>
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