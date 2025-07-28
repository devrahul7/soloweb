// Import all your existing images here
import newspaperImage from '../assets/newspaper.jpg';
import magazineImage from '../assets/magazine.jpg';
import booksmagImage from '../assets/booksmagazine.jpg';
import cardboardImage from '../assets/cardboard.jpg';
import copyImage from '../assets/copy.jpg';
import invitationImage from '../assets/invitationcard.jpg';
import eggImage from '../assets/eggcrates.jpg';
import cartoonImage from '../assets/cartoon.jpg';
import confidentalImage from '../assets/confidental.jpg';
import plasticBottleImage from '../assets/plasticbottle.jpg';
import glassBottleImage from '../assets/glassbottles.jpg';
import plasticBagImage from '../assets/plasticbag.jpeg';
import containerImage from '../assets/plasticcontainer.jpg';
import jarImage from '../assets/glassjars.jpg';
import cupImage from '../assets/plasticcup.jpeg';
import tubeImage from '../assets/plastictubes.webp';
import wrapperImage from '../assets/plasticwrappers.jpeg';
import toyImage from '../assets/plastictoys.jpg';
import aluminumCanImage from '../assets/alumuniumcans.jpeg';
import ironImage from '../assets/ironscrap.jpeg';
import copperImage from '../assets/copperwire.jpeg';
import steelImage from '../assets/steelitems.jpeg';
import wireImage from '../assets/mixedmetalwire.jpeg';
import metalScrapImage from '../assets/heavymetalscrap.jpeg';
import mobileImage from '../assets/mobilephones.jpeg';
import laptopImage from '../assets/laptoprecycle.jpeg';
import tvImage from '../assets/television.jpeg';
import printerImage from '../assets/printer.jpeg';
import batteryImage from '../assets/battery.jpeg';
import circuitImage from '../assets/circuitimage.jpeg';
import brassPipeImage from '../assets/brassimage.jpeg';
import brassVesselImage from '../assets/brassvessel.jpeg';
import brassFittingImage from '../assets/brassfittings.jpeg';
import rubberImage from '../assets/rubberwaste.jpeg';
import fabricImage from '../assets/fabrics.jpeg';
import woodImage from '../assets/woodscrap.jpg';

export const recycleItems = {
    'Paper': [
        {
            id: 'paper_1',
            image: newspaperImage,
            name: 'Newspaper',
            price: 'Est. Rs.9/Kgs',
            description: 'What are you going to do with old news anyway',
            category: 'Paper'
        },
        {
            id: 'paper_2',
            image: magazineImage,
            name: 'Magazines',
            price: 'Est. Rs.7/Kgs',
            description: 'Even guests prefer new issues',
            category: 'Paper'
        },
        {
            id: 'paper_3',
            image: booksmagImage,
            name: 'Books & Magazine',
            price: 'Est. Rs.8/Kgs',
            description: 'Give your book a new life',
            category: 'Paper'
        },
        {
            id: 'paper_4',
            image: cardboardImage,
            name: 'Cardboard',
            price: 'Est. Rs.9/Kgs',
            description: "Don't hoard the board",
            category: 'Paper'
        },
        {
            id: 'paper_5',
            image: copyImage,
            name: 'Copy',
            price: 'Est. Rs.12/Kgs',
            description: 'Copy, paste, recycle',
            category: 'Paper'
        },
        {
            id: 'paper_6',
            image: eggImage,
            name: 'Egg crates',
            price: 'Est. Rs.5/Kgs',
            description: 'Create new crates',
            category: 'Paper'
        },
        {
            id: 'paper_7',
            image: invitationImage,
            name: 'Invitation cards',
            price: 'Est. Rs.6/Kgs',
            description: 'You are invited to recycle',
            category: 'Paper'
        },
        {
            id: 'paper_8',
            image: cartoonImage,
            name: 'Carton',
            price: 'Est. Rs.8/Kgs',
            description: 'Carton recycling made easy',
            category: 'Paper'
        },
        {
            id: 'paper_9',
            image: confidentalImage,
            name: 'Confidential Documents',
            price: 'Est. Rs.7/Kgs',
            description: 'Secure document disposal',
            category: 'Paper'
        }
    ],
    'Glass and Plastic': [
        {
            id: 'plastic_1',
            image: plasticBottleImage,
            name: 'Plastic Bottles',
            price: 'Est. Rs.15/Kgs',
            description: 'Clear and colored plastic bottles',
            category: 'Glass and Plastic'
        },
        {
            id: 'glass_1',
            image: glassBottleImage,
            name: 'Glass Bottles',
            price: 'Est. Rs.8/Kgs',
            description: 'Beer, wine, and beverage bottles',
            category: 'Glass and Plastic'
        },
        {
            id: 'plastic_2',
            image: plasticBagImage,
            name: 'Plastic Bags',
            price: 'Est. Rs.10/Kgs',
            description: 'Shopping and grocery bags',
            category: 'Glass and Plastic'
        },
        {
            id: 'plastic_3',
            image: containerImage,
            name: 'Plastic Containers',
            price: 'Est. Rs.12/Kgs',
            description: 'Food containers and tubs',
            category: 'Glass and Plastic'
        },
        {
            id: 'glass_2',
            image: jarImage,
            name: 'Glass Jars',
            price: 'Est. Rs.6/Kgs',
            description: 'Pickle and jam jars',
            category: 'Glass and Plastic'
        },
        {
            id: 'plastic_4',
            image: cupImage,
            name: 'Plastic Cups',
            price: 'Est. Rs.8/Kgs',
            description: 'Disposable cups and glasses',
            category: 'Glass and Plastic'
        },
        {
            id: 'plastic_5',
            image: tubeImage,
            name: 'Plastic Tubes',
            price: 'Est. Rs.14/Kgs',
            description: 'Cosmetic and toothpaste tubes',
            category: 'Glass and Plastic'
        },
        {
            id: 'plastic_6',
            image: wrapperImage,
            name: 'Plastic Wrappers',
            price: 'Est. Rs.5/Kgs',
            description: 'Food packaging wrappers',
            category: 'Glass and Plastic'
        },
        {
            id: 'plastic_7',
            image: toyImage,
            name: 'Plastic Toys',
            price: 'Est. Rs.7/Kgs',
            description: 'Broken or unused plastic toys',
            category: 'Glass and Plastic'
        }
    ],
    'Metal & Steel': [
        {
            id: 'metal_1',
            image: aluminumCanImage,
            name: 'Aluminum Cans',
            price: 'Est. Rs.120/Kgs',
            description: 'Beverage cans and containers',
            category: 'Metal & Steel'
        },
        {
            id: 'metal_2',
            image: ironImage,
            name: 'Iron Scrap',
            price: 'Est. Rs.25/Kgs',
            description: 'Old iron pieces and rods',
            category: 'Metal & Steel'
        },
        {
            id: 'metal_3',
            image: copperImage,
            name: 'Copper Wire',
            price: 'Est. Rs.580/Kgs',
            description: 'Electrical copper wiring',
            category: 'Metal & Steel'
        },
        {
            id: 'metal_4',
            image: steelImage,
            name: 'Steel Items',
            price: 'Est. Rs.28/Kgs',
            description: 'Steel utensils and appliances',
            category: 'Metal & Steel'
        },
        {
            id: 'metal_5',
            image: wireImage,
            name: 'Mixed Metal Wire',
            price: 'Est. Rs.45/Kgs',
            description: 'Various metal wires and cables',
            category: 'Metal & Steel'
        },
        {
            id: 'metal_6',
            image: metalScrapImage,
            name: 'Heavy Metal Scrap',
            price: 'Est. Rs.22/Kgs',
            description: 'Large metal pieces and machinery parts',
            category: 'Metal & Steel'
        }
    ],
    'E-waste': [
        {
            id: 'ewaste_1',
            image: mobileImage,
            name: 'Mobile Phones',
            price: 'Est. Rs.50/piece',
            description: 'Old smartphones and feature phones',
            category: 'E-waste'
        },
        {
            id: 'ewaste_2',
            image: laptopImage,
            name: 'Laptops',
            price: 'Est. Rs.200/piece',
            description: 'Broken or old laptops',
            category: 'E-waste'
        },
        {
            id: 'ewaste_3',
            image: tvImage,
            name: 'Television',
            price: 'Est. Rs.150/piece',
            description: 'CRT and LCD televisions',
            category: 'E-waste'
        },
        {
            id: 'ewaste_4',
            image: printerImage,
            name: 'Printers',
            price: 'Est. Rs.100/piece',
            description: 'Inkjet and laser printers',
            category: 'E-waste'
        },
        {
            id: 'ewaste_5',
            image: batteryImage,
            name: 'Batteries',
            price: 'Est. Rs.80/Kgs',
            description: 'Mobile and laptop batteries',
            category: 'E-waste'
        },
        {
            id: 'ewaste_6',
            image: circuitImage,
            name: 'Circuit Boards',
            price: 'Est. Rs.300/Kgs',
            description: 'Computer and electronic boards',
            category: 'E-waste'
        }
    ],
    'Brass': [
        {
            id: 'brass_1',
            image: brassPipeImage,
            name: 'Brass Pipes',
            price: 'Est. Rs.380/Kgs',
            description: 'Plumbing brass pipes and fittings',
            category: 'Brass'
        },
        {
            id: 'brass_2',
            image: brassVesselImage,
            name: 'Brass Vessels',
            price: 'Est. Rs.350/Kgs',
            description: 'Traditional brass utensils',
            category: 'Brass'
        },
        {
            id: 'brass_3',
            image: brassFittingImage,
            name: 'Brass Fittings',
            price: 'Est. Rs.370/Kgs',
            description: 'Door handles and decorative items',
            category: 'Brass'
        }
    ],
    'Others': [
        {
            id: 'others_1',
            image: rubberImage,
            name: 'Rubber Items',
            price: 'Est. Rs.15/Kgs',
            description: 'Rubber tubes and sheets',
            category: 'Others'
        },
        {
            id: 'others_2',
            image: fabricImage,
            name: 'Fabric Waste',
            price: 'Est. Rs.8/Kgs',
            description: 'Old clothes and textiles',
            category: 'Others'
        },
        {
            id: 'others_3',
            image: woodImage,
            name: 'Wood Scrap',
            price: 'Est. Rs.5/Kgs',
            description: 'Wooden furniture pieces',
            category: 'Others'
        }
    ]
};

export const getAllItems = () => {
    const allItems = [];
    Object.values(recycleItems).forEach(categoryItems => {
        allItems.push(...categoryItems);
    });
    return allItems;
};
