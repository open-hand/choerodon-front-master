import React from 'react';
import './index.less';
const clsPrefix = "c7n-project-overview-empty-page";
function EmptyImg({ height, width }) {
    return <svg width={width} height={height} viewBox="0 0 111 79" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
        <g id="缺省页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="所有报告-" transform="translate(-498.000000, -283.000000)">
                <g id="Group-Copy" transform="translate(498.000000, 283.000000)">
                    <rect id="Rectangle-7-Copy-13" fill="#DEE0ED" x="0" y="0" width="110.4" height="78.8333333" rx="2.4"></rect>
                    <path d="M0,14.3333333 L110.4,14.3333333 L110.4,76.4333333 C110.4,77.7588167 109.325483,78.8333333 108,78.8333333 L2.4,78.8333333 C1.0745166,78.8333333 -1.16994273e-15,77.7588167 0,76.4333333 L0,14.3333333 L0,14.3333333 Z" id="Rectangle-7-Copy-13" fill="#F2F4FD"></path>
                    <rect id="Rectangle-21-Copy-14" fill="#F9FAFF" x="4.8" y="5.375" width="4.8" height="4.77777778" rx="2.38888889"></rect>
                    <rect id="Rectangle-21-Copy-19" fill="#F9FAFF" x="13.2" y="5.375" width="4.8" height="4.77777778" rx="2.38888889"></rect>
                    <rect id="Rectangle-21-Copy-18" fill="#F9FAFF" x="21.6" y="5.375" width="28.8" height="4.77777778" rx="2.38888889"></rect>
                    <g id="Group-9" transform="translate(18.000000, 14.000000)">
                        <g id="Group-7" transform="translate(37.742224, 36.768915) rotate(-45.000000) translate(-37.742224, -36.768915) translate(16.742224, 5.768915)">
                            <rect id="Rectangle-25" fill="#6776C4" x="19.5030843" y="39.9325341" width="3.03157895" height="6.04978355"></rect>
                            <rect id="Rectangle-25-Copy" fill="#2A2E76" x="17.2981394" y="44.0158925" width="7.07368421" height="17.1410534" rx="1.2"></rect>
                            <circle id="Oval-11" fill="#3D42A3" cx="21" cy="21" r="21"></circle>
                            <circle id="Oval-11" fill="#FFBA1C" cx="21.0188737" cy="21.4461818" r="15"></circle>
                        </g>
                        <path d="M31,22 C33.7614237,22 36,24.3281193 36,27.2 C36,29.8961456 34.0270058,32.1130411 31.5006616,32.3742565 L31.5,35 L29.5,35 L29.5,30.32 L31,30.32 L31,30.32 C32.6568542,30.32 34,28.9231284 34,27.2 C34,25.4768716 32.6568542,24.08 31,24.08 C29.3431458,24.08 28,25.4768716 28,27.2 L26,27.2 C26,24.3281193 28.2385763,22 31,22 Z" id="Combined-Shape" fill="#FFFFFF"></path>
                        <circle id="Oval-13" fill="#FFFFFF" cx="30.5" cy="37.5" r="1.5"></circle>
                    </g>
                </g>
            </g>
        </g>
    </svg>

}
export function EmptyPage({ imgHeight, imgWidth }) {

    return <div className={clsPrefix}>
        <EmptyImg height={80} width={80} />
        {/* <div className={`${clsPrefix}-img`} /> */}
        <div className={`${clsPrefix}-text`}>
            当前冲刺下无问题
        </div>

    </div>
}
