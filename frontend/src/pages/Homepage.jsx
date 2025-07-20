import Navbar from "../components/Navbar";
import '../cssfolder/Homepage.css'
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import dustbinImage from '../assets/dustbin.png';
import infoImage from '../assets/info.png';
import bottlesImage from '../assets/bottles.png';
import Footer from "../components/Footer";

// Eco images for hero section
import earthImage from '../assets/recylcelogo.webp';
import greenlivingImage from '../assets/greenliving.webp';
import recycleImage from '../assets/recycleimage.png';
import waterImage from '../assets/waterearth.png';
import reuseImage from '../assets/reuse.jpg';

// Paper category images
import newspaperImage from '../assets/newspaper.jpg';
import magazineImage from '../assets/magazine.jpg';
import booksmagImage from '../assets/booksmagazine.jpg';
import cardboardImage from '../assets/cardboard.jpg';
import copyImage from '../assets/copy.jpg';
import invitationImage from '../assets/invitationcard.jpg';
import eggImage from '../assets/eggcrates.jpg';
import cartoonImage from '../assets/cartoon.jpg';
import confidentalImage from '../assets/confidental.jpg';

// Glass and Plastic category images 
import plasticBottleImage from '../assets/plasticbottle.jpg';
import glassBottleImage from '../assets/glassbottles.jpg';
import plasticBagImage from '../assets/plasticbag.jpeg';
import containerImage from '../assets/plasticcontainer.jpg';
import jarImage from '../assets/glassjars.jpg';
import cupImage from '../assets/plasticcup.jpeg';
import tubeImage from '../assets/plastictubes.webp';
import wrapperImage from '../assets/plasticwrappers.jpeg';
import toyImage from '../assets/plastictoys.jpg';

// Metal and steel category
import aluminumCanImage from '../assets/alumuniumcans.jpeg';
import ironImage from '../assets/ironscrap.jpeg';
import copperImage from '../assets/copperwire.jpeg';
import steelImage from '../assets/steelitems.jpeg';
import wireImage from '../assets/mixedmetalwire.jpeg';
import metalScrapImage from '../assets/heavymetalscrap.jpeg';

// E-waste category 
import mobileImage from '../assets/mobilephones.jpeg';
import laptopImage from '../assets/laptoprecycle.jpeg';
import tvImage from '../assets/television.jpeg';
import printerImage from '../assets/printer.jpeg';
import batteryImage from '../assets/battery.jpeg';
import circuitImage from '../assets/circuitimage.jpeg';

// Brass category
import brassPipeImage from '../assets/brassimage.jpeg';
import brassVesselImage from '../assets/brassvessel.jpeg';
import brassFittingImage from '../assets/brassfittings.jpeg';

// Others category 
import rubberImage from '../assets/rubberwaste.jpeg';
import fabricImage from '../assets/fabrics.jpeg';
import woodImage from '../assets/woodscrap.jpg';

export default function Homepage(){
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('Paper');
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    const playWelcomeAudio = () => {
        if ('speechSynthesis' in window) {
            // Stop any ongoing speech
            speechSynthesis.cancel();
            
            setIsAudioPlaying(true);
            
            const utterance = new SpeechSynthesisUtterance('Rahul Welcome you to ecosajha recycling website. Lets Be a Proud Recycler. Recycle Now');
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            // Add event listeners for when speech ends
            utterance.onend = () => {
                setIsAudioPlaying(false);
            };
            
            utterance.onerror = () => {
                setIsAudioPlaying(false);
            };
            
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                utterance.voice = voices[0];
            }
            
            speechSynthesis.speak(utterance);
        } else {
            console.log('Speech synthesis not supported');
            alert('Welcome to recycling website');
            setIsAudioPlaying(false);
        }
    };

    const categoryData = {
        'Paper': [
            {
                image: newspaperImage,
                name: 'Newspaper',
                price: 'Est. Rs.9/Kgs',
                description: 'What are you going to do with old news anyway'
            },
            {
                image: magazineImage,
                name: 'Magazines',
                price: 'Est. Rs.7/Kgs',
                description: 'Even guests prefer new issues'
            },
            {
                image: booksmagImage,
                name: 'Books & Magazine',
                price: 'Est. Rs.8/Kgs',
                description: 'Give your book a new life'
            },
            {
                image: cardboardImage,
                name: 'Cardboard',
                price: 'Est. Rs.9/Kgs',
                description: "Don't hoard the board"
            },
            {
                image: copyImage,
                name: 'Copy',
                price: 'Est. Rs.12/Kgs',
                description: 'Copy, paste, recycle'
            },
            {
                image: eggImage,
                name: 'Egg crates',
                price: 'Est. Rs.5/Kgs',
                description: 'Create new crates'
            },
            {
                image: invitationImage,
                name: 'Invitation cards',
                price: 'Est. Rs.6/Kgs',
                description: 'You are invited to recycle'
            },
            {
                image: cartoonImage,
                name: 'Carton',
                price: 'Est. Rs.8/Kgs',
                description: 'Carton recycling made easy'
            },
            {
                image: confidentalImage,
                name: 'Confidential Documents',
                price: 'Est. Rs.7/Kgs',
                description: 'Secure document disposal'
            }
        ],
        'Glass and Plastic': [
            {
                image: plasticBottleImage,
                name: 'Plastic Bottles',
                price: 'Est. Rs.15/Kgs',
                description: 'Clear and colored plastic bottles'
            },
            {
                image: glassBottleImage,
                name: 'Glass Bottles',
                price: 'Est. Rs.8/Kgs',
                description: 'Beer, wine, and beverage bottles'
            },
            {
                image: plasticBagImage,
                name: 'Plastic Bags',
                price: 'Est. Rs.10/Kgs',
                description: 'Shopping and grocery bags'
            },
            {
                image: containerImage,
                name: 'Plastic Containers',
                price: 'Est. Rs.12/Kgs',
                description: 'Food containers and tubs'
            },
            {
                image: jarImage,
                name: 'Glass Jars',
                price: 'Est. Rs.6/Kgs',
                description: 'Pickle and jam jars'
            },
            {
                image: cupImage,
                name: 'Plastic Cups',
                price: 'Est. Rs.8/Kgs',
                description: 'Disposable cups and glasses'
            },
            {
                image: tubeImage,
                name: 'Plastic Tubes',
                price: 'Est. Rs.14/Kgs',
                description: 'Cosmetic and toothpaste tubes'
            },
            {
                image: wrapperImage,
                name: 'Plastic Wrappers',
                price: 'Est. Rs.5/Kgs',
                description: 'Food packaging wrappers'
            },
            {
                image: toyImage,
                name: 'Plastic Toys',
                price: 'Est. Rs.7/Kgs',
                description: 'Broken or unused plastic toys'
            }
        ],
        'Metal & Steel': [
            {
                image: aluminumCanImage,
                name: 'Aluminum Cans',
                price: 'Est. Rs.120/Kgs',
                description: 'Beverage cans and containers'
            },
            {
                image: ironImage,
                name: 'Iron Scrap',
                price: 'Est. Rs.25/Kgs',
                description: 'Old iron pieces and rods'
            },
            {
                image: copperImage,
                name: 'Copper Wire',
                price: 'Est. Rs.580/Kgs',
                description: 'Electrical copper wiring'
            },
            {
                image: steelImage,
                name: 'Steel Items',
                price: 'Est. Rs.28/Kgs',
                description: 'Steel utensils and appliances'
            },
            {
                image: wireImage,
                name: 'Mixed Metal Wire',
                price: 'Est. Rs.45/Kgs',
                description: 'Various metal wires and cables'
            },
            {
                image: metalScrapImage,
                name: 'Heavy Metal Scrap',
                price: 'Est. Rs.22/Kgs',
                description: 'Large metal pieces and machinery parts'
            }
        ],
        'E-waste': [
            {
                image: mobileImage,
                name: 'Mobile Phones',
                price: 'Est. Rs.50/piece',
                description: 'Old smartphones and feature phones'
            },
            {
                image: laptopImage,
                name: 'Laptops',
                price: 'Est. Rs.200/piece',
                description: 'Broken or old laptops'
            },
            {
                image: tvImage,
                name: 'Television',
                price: 'Est. Rs.150/piece',
                description: 'CRT and LCD televisions'
            },
            {
                image: printerImage,
                name: 'Printers',
                price: 'Est. Rs.100/piece',
                description: 'Inkjet and laser printers'
            },
            {
                image: batteryImage,
                name: 'Batteries',
                price: 'Est. Rs.80/Kgs',
                description: 'Mobile and laptop batteries'
            },
            {
                image: circuitImage,
                name: 'Circuit Boards',
                price: 'Est. Rs.300/Kgs',
                description: 'Computer and electronic boards'
            }
        ],
        'Brass': [
            {
                image: brassPipeImage,
                name: 'Brass Pipes',
                price: 'Est. Rs.380/Kgs',
                description: 'Plumbing brass pipes and fittings'
            },
            {
                image: brassVesselImage,
                name: 'Brass Vessels',
                price: 'Est. Rs.350/Kgs',
                description: 'Traditional brass utensils'
            },
            {
                image: brassFittingImage,
                name: 'Brass Fittings',
                price: 'Est. Rs.370/Kgs',
                description: 'Door handles and decorative items'
            }
        ],
        'Others': [
            {
                image: rubberImage,
                name: 'Rubber Items',
                price: 'Est. Rs.15/Kgs',
                description: 'Rubber tubes and sheets'
            },
            {
                image: fabricImage,
                name: 'Fabric Waste',
                price: 'Est. Rs.8/Kgs',
                description: 'Old clothes and textiles'
            },
            {
                image: woodImage,
                name: 'Wood Scrap',
                price: 'Est. Rs.5/Kgs',
                description: 'Wooden furniture pieces'
            }
        ],
        'PET bottle': [
            {
                image: infoImage,
                name: 'Conditions Apply',
                price: '',
                description: (
                    <div className="conditions-container">
                        <ul className="conditions-list">
                            <li>All rates are estimates</li>
                            <li>Sometimes rates are mutually decided at the venue</li>
                            <li>Not everything listed here as examples might be accepted by all Khaalisisi friends</li>
                            <li>Broken glass items are not accepted</li>
                        </ul>
                    </div>
                )
            }
        ]
    };

    return (
        <>
            <Navbar/>
            <div>
                <section className="hero">
                    <div className="hero-content">
                        <h1>Waste Collection Made Easy</h1>
                        <p>Schedule a pickup for your waste</p>
                        
                        <div className="hero-buttons">
                            <button onClick={() => { navigate('/login')}} className="request-btn">Request Pickup</button>
                            <button className="what-we-buy-btn" onClick={() => {
                                const element = document.querySelector('.categories-section');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}>What We Buy</button>
                        </div>
                        
                        {/* Updated scrollable eco images container */}
                        <div className="eco-images-container">
                            <div className="eco-images">
                                <div className="eco-image-item">
                                    <img src={greenlivingImage} alt="Eco house with solar panels" />
                                    <span>Green Living</span>
                                </div>
                                <div className="eco-image-item">
                                    <img src={earthImage} alt="Save Earth" />
                                    <span>Save Earth</span>
                                </div>
                                <div className="eco-image-item">
                                    <img src={recycleImage} alt="Recycle bottles" />
                                    <span>Recycle</span>
                                </div>
                                <div className="eco-image-item">
                                    <img src={waterImage} alt="Conservation" />
                                    <span>Conservation</span>
                                </div>
                                <div className="eco-image-item">
                                    <img src={reuseImage} alt="Reuse" />
                                    <span>Reuse</span>
                                </div>
                                <div className="eco-image-item">
                                    <img src={greenlivingImage} alt="Sustainable living" />
                                    <span>Sustainable</span>
                                </div>
                                <div className="eco-image-item">
                                    <img src={earthImage} alt="Eco-friendly" />
                                    <span>Eco-Friendly</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Updated Video Section with playing indicator */}
                <section className="video-section">
                    <div className="video-content">
                        <h2 className="trash">Got TRASH</h2>
                        <div className={`play-btn ${isAudioPlaying ? 'playing' : ''}`} onClick={playWelcomeAudio}>
                            {isAudioPlaying ? (
                                <div className="sound-waves">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            ) : (
                                "▶"
                            )}
                        </div>
                        <div className="video-text">
                            <p><strong>Be a Proud Recycler</strong></p>
                            <p>Request pickup now</p>
                            {isAudioPlaying && <p className="playing-indicator">🔊 Playing audio...</p>}
                        </div>
                    </div>
                    <div className="video-image">
                        <img id="dustbin" src={dustbinImage} alt="dustbin image" /> 
                    </div>
                </section>

                <div className="bottles-container">
                    <img id="bottles" src={bottlesImage} alt="bottles image" /> 
                </div>

                {/* About Section */}
                <section className="about-section">
                    <div className="about-content">
                        <div className="about-text">
                            <h2>Why EcoSajha?</h2>
                            <div className="info-image-container">
                                <img id="infoimage" src={infoImage} alt="info image" /> 
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="categories-section">
                    <h2 className="categories-title">WHAT WE BUY?</h2>
                    
                    <div className="categories-nav">
                        {Object.keys(categoryData).filter(cat => cat !== 'PET bottle').map((category) => (
                            <button 
                                key={category}
                                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                        <button 
                            className={`category-tab ${activeCategory === 'PET bottle' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('PET bottle')}
                        >
                            Conditions
                        </button>
                    </div>

                    {/* Items Grid */}
                    <div className="items-grid">
                        {categoryData[activeCategory]?.map((item, index) => (
                            <div key={index} className="item-card">
                                <div className="item-image">
                                    <img className="news" src={item.image} alt={`${item.name} image`} /> 
                                </div>
                                <h3>{item.name}</h3>
                                {item.price && <p className="item-price">{item.price}</p>}
                                <div className="item-description">{item.description}</div>
                            </div>
                        ))}
                    </div>
                </section>
                <Footer/>
            </div>
        </>
    );
}
