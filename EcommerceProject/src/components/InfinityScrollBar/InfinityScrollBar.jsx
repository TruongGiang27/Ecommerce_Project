import spotifyLogo from "../../assets/images/spotify-logo.png";
import netflixLogo from "../../assets/images/netflix-logo.png";
import adobeLogo from "../../assets/images/adobe-logo.png";
import chatgptLogo from "../../assets/images/chatgpt-logo.png";
import antiVirusLogo from "../../assets/images/anti-virus-logo.png";
import vpnLogo from "../../assets/images/vpn-logo.png";
import elsaSpeakLogo from "../../assets/images/elsa-speak-logo.png";
import microsoftLogo from "../../assets/images/microsoft-logo.png";
import tinderLogo from "../../assets/images/tinder-logo.png";
import youtubeLogo from "../../assets/images/youtube_logo.png";
import duolingoLogo from "../../assets/images/duolingo-logo.png";
import "./InfinityScrollBar.css";
import { Link } from "react-router-dom";

const logos = [
  {
    src: spotifyLogo,
    name: "Spotify",
    link: "/products/prod_01K72DZQB15YCF1YSQTD3WPYF3",
  },
  {
    src: netflixLogo,
    name: "Netflix",
    link: "/products/prod_01K73GH4C095RABRJYHGY4M4N3",
  },
  {
    src: adobeLogo,
    name: "Adobe",
    link: "/products/prod_01K8M9VB03HV2BMA103T60N0EH",
  },
  {
    src: chatgptLogo,
    name: "Chat GPT 4.0",
    link: "/products/prod_01K8MB1QGG41PGF6TW6EMV8WE5",
  },
  {
    src: antiVirusLogo,
    name: "Anti Virus",
    link: "/products?category=Diệt Virus",
  },
  { src: vpnLogo, name: "VPN", link: "/products?category=VPN" },
  { src: elsaSpeakLogo, name: "Elsa Premium", link: "/" },
  {
    src: microsoftLogo,
    name: "Microsoft",
    link: "/products?category=Microsoft",
  },
  {
    src: tinderLogo,
    name: "Tinder",
    link: "/products/prod_01K729GBC2K15QSYVGC7RFMBPS",
  },
  {
    src: youtubeLogo,
    name: "YouTube",
    link: "/products/prod_01K73F3JEKSPGGJEQ99ZFFRFEC",
  },
  {
    src: duolingoLogo,
    name: "Duolingo",
    link: "/products/prod_01K73N1X5ZTHV9QRJXTNQBEJ2N",
  },
];

export default function InfinityScrollBar() {
  return (
    <div className="main-container">
      <div className="tag-list">
        <div className="inner">
          {[...logos, ...logos].map((logo, index) => (
            <Link to={logo.link} key={index} className="tag">
              <img
                src={logo.src}
                alt={`${logo.name} Logo`}
                className="tag-logo"
              />
              <p className="tag-text">{logo.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
