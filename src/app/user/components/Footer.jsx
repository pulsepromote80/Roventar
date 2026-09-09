'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer 
      className="footer-wrapper footer-layout2" 
      data-bg-src="assets/img/bg/footer_bg_2.png"
      style={{ backgroundImage: "url('/assets/img/bg/footer_bg_2.png')" }}
    >
      <div className="container">
        <div className="widget-area">
          <div className="footer-top">
            <div className="row gx-40 gy-4 justify-content-center justify-content-lg-between">
              <div className="col-lg-5 col-xl-4">
                <div className="footer-logo">
                  <Image 
                    src="/white.png" 
                    alt="Aior Logo" 
                    width={150} 
                    height={50}
                  />
                </div>
                <div className="th-widget-about">
              <p className="about-text text-white">
  The all-in-one intelligent arbitrage system for DeFi markets. Built onchain with 
  real-time transparency and non-custodial security.
</p> 
              </div>
              </div>
              <div className="col-lg-6 col-xl-5">
                <div className="ps-xl-5">
                  <h2 className="box-title text-white">Try Roventor Today Free</h2>
                  <div className="btn-group justify-content-center justify-content-lg-start">
                    <Link href="/" className="th-btn2">Start Free Trial</Link>
                    <Link href="/" className="th-btn2 style3">Book</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  
      <div className="container">
        <div className="copyright-wrap">
          <div className="row gy-2 align-items-center justify-content-between">
            <p className="copyright-text">
              <i className="fal fa-copyright"></i> Copyright <Link href="/" target="_blank" rel="noopener noreferrer">XOXOFX</Link> 2026 . All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}