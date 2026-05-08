/* eslint-disable @next/next/no-img-element */
export default function Footer() {
  return (
    <footer className="site-footer" id="organizatorzy">
      <div className="footer-top">
        <div className="footer-cols">
          <div className="footer-col">
            <h3>Our services</h3>
            <ul>
              <li>Software development</li>
              <li>Body Leasing/Team Leasing</li>
              <li>IT infrastructure</li>
              <li>Innovations</li>
              <li>Performance</li>
              <li>Trade Transformation</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>The Good People</h3>
            <ul>
              <li>About us</li>
              <li>EU projects</li>
              <li>GDPR</li>
              <li>Inquiries</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Insights</h3>
            <ul>
              <li>News</li>
              <li>Case studies</li>
              <li>Articles</li>
            </ul>
          </div>
        </div>
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>sales-na@euvic.com<br />+1(201) 289-8322</p>
          <p>One International Blvd, Suite 1105<br />Mahwah, NJ 07495<br />United States</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-logo"><img src="/assets/logo.8fea627a.svg" alt="Euvic" /></div>
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><img src="/assets/icon-fb.svg" alt="" /></a>
          <a href="#" aria-label="YouTube"><img src="/assets/icon-yt.svg" alt="" /></a>
          <a href="#" aria-label="LinkedIn"><img src="/assets/icon-li.svg" alt="" /></a>
        </div>
      </div>
      <div className="footer-legal" id="polityka-prywatnosci">
        <a href="#">Polityka prywatności</a>
      </div>
    </footer>
  );
}
