// ================================================
// RECIPE DATABASE - 30 RECIPES
// 10 Breakfast (3 Ukrainian) + 20 Batch Cook (5 Ukrainian)
// ================================================

// ===================================
// BREAKFAST RECIPES (R1-R10)
// ===================================

const defaultRecipes = {
    
    // === UKRAINIAN BREAKFAST #1 ===
    R1: {
        id: "R1",
        name: "Syrniki (Ukrainian Cheese Pancakes)",
        category: "breakfast",
        serves: 1,
        prepTime: "10 mins",
        cookTime: "15 mins",
        
        aiPrompt: "cottage_cheese:200g, eggs:1, flour:40g, sugar:15g, butter:20g",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "British Barn Eggs", qtyNeeded: 1, unit: "eggs" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "BUTTERPAK", qtyNeeded: 20, unit: "g" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "Cottage Cheese", qtyNeeded: 200, unit: "g" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Flour (Plain)", qtyNeeded: 0.04, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Sugar (White)", qtyNeeded: 0.015, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "BRITISH COOKING SALT", qtyNeeded: 0.005, unit: "kg" }
        ],
        
        display: {
            emoji: "🥞",
            description: "Traditional Ukrainian cottage cheese pancakes - crispy outside, fluffy inside. Perfect with sour cream!",
            
            ingredients: [
                "200g cottage cheese (or tvorog if available)",
                "1 large egg",
                "40g plain flour (about 3 tablespoons)",
                "15g sugar (1 tablespoon)",
                "20g butter for frying",
                "Pinch of salt",
                "Optional: sour cream and jam for serving"
            ],
            
            instructions: [
                "Press cottage cheese through a sieve or mash with fork until smooth - this is crucial for fluffy syrniki",
                "In a bowl, mix cottage cheese, egg, sugar, and pinch of salt until well combined",
                "Add flour gradually, mixing until you get a thick, slightly sticky dough (not too wet, not too dry)",
                "Let the mixture rest for 5 minutes - this helps the flour absorb moisture",
                "Dust your hands with flour, take a spoonful of mixture and shape into small flat patties (about 5cm diameter, 1.5cm thick)",
                "Heat butter in a non-stick pan over MEDIUM heat (not too hot or they'll burn outside and stay raw inside)",
                "Carefully place patties in the pan, cook for 3-4 minutes until golden brown on the bottom",
                "Flip gently and cook another 3-4 minutes until both sides are golden and cooked through",
                "Remove to a plate and serve immediately while hot"
            ],
            
            tips: [
                "🇺🇦 In Ukraine, we use tvorog (farmer's cheese) which is drier than cottage cheese. If your cottage cheese is watery, drain it first!",
                "🔥 Medium heat is key - too hot and they burn, too low and they absorb too much oil",
                "👌 The dough should be just firm enough to shape but still soft - if too sticky, add a tiny bit more flour",
                "🍓 Serve with sour cream (smetana) and jam - strawberry or raspberry is traditional",
                "❄️ You can freeze uncooked syrniki and fry them straight from frozen - add 2 extra minutes cooking time"
            ],
            
            video: "https://www.youtube.com/watch?v=j8FN0DdQNM0",
            nutrition: "Per serving: 380 cal, 20g protein, 15g fat, 35g carbs"
        }
    },
    
    // === UKRAINIAN BREAKFAST #2 ===
    R2: {
        id: "R2",
        name: "Buckwheat Kasha with Milk (Hrechana Kasha)",
        category: "breakfast",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "15 mins",
        
        aiPrompt: "buckwheat:80g, milk:200ml, butter:10g, sugar:10g",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "Milk (Semi-Skimmed)", qtyNeeded: 0.2, unit: "L" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "BUTTERPAK", qtyNeeded: 10, unit: "g" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Sugar (White)", qtyNeeded: 0.01, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Buckwheat Groats", qtyNeeded: 0.08, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "BRITISH COOKING SALT", qtyNeeded: 0.005, unit: "kg" },
            { shop: "Tesco", category: "🥤 Drinks", itemName: "Water (Still)", qtyNeeded: 0.16, unit: "L" }
        ],
        
        display: {
            emoji: "🥣",
            description: "Classic Ukrainian breakfast porridge - nutty buckwheat cooked until tender, served with warm milk. Comfort food that keeps you full for hours!",
            
            ingredients: [
                "80g buckwheat groats (uncooked)",
                "200ml semi-skimmed milk",
                "10g butter",
                "10g sugar (or to taste)",
                "Pinch of salt",
                "160ml water for cooking"
            ],
            
            instructions: [
                "Rinse buckwheat under cold water in a fine sieve until water runs clear",
                "In a small pot, bring 160ml water to boil with a pinch of salt",
                "Add rinsed buckwheat, stir once, then reduce heat to LOW",
                "Cover with lid and simmer for 12-15 minutes until water is absorbed and buckwheat is tender",
                "Turn off heat and let it sit covered for 5 minutes - this makes it fluffy",
                "In a separate small pot, warm the milk (don't boil)",
                "Fluff buckwheat with fork, transfer to a bowl",
                "Add butter and stir until melted",
                "Pour warm milk over the buckwheat, add sugar, stir and serve immediately"
            ],
            
            tips: [
                "🇺🇦 In Ukraine, this is a staple breakfast - cheap, filling, and nutritious",
                "💪 Buckwheat is naturally gluten-free and high in protein",
                "🧈 Some Ukrainians add a big knob of butter in the middle - very traditional!",
                "🍯 Try with honey instead of sugar for a healthier option",
                "❄️ Leftover kasha can be fried the next day with onions - delicious!"
            ],
            
            video: "https://www.youtube.com/watch?v=XcF0QYLnUzs",
            nutrition: "Per serving: 340 cal, 12g protein, 8g fat, 52g carbs"
        }
    },
    
    // === UKRAINIAN BREAKFAST #3 ===
    R3: {
        id: "R3",
        name: "Ukrainian-Style Scrambled Eggs with Salo",
        category: "breakfast",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "8 mins",
        
        aiPrompt: "eggs:3, bacon:50g, onion:30g, tomato:1",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "British Barn Eggs", qtyNeeded: 3, unit: "eggs" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.03, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Tomatoes", qtyNeeded: 0.1, unit: "kg" }
        ],
        
        display: {
            emoji: "🍳",
            description: "Ukrainian breakfast staple - eggs scrambled with crispy bacon (or salo), onions, and fresh tomatoes. Hearty and delicious!",
            
            ingredients: [
                "3 large eggs",
                "50g bacon (or salo if you can find it)",
                "30g onion (about 1/4 small onion), finely chopped",
                "1 small tomato, diced",
                "Salt and black pepper to taste",
                "Fresh dill for garnish (optional but very Ukrainian!)"
            ],
            
            instructions: [
                "Cut bacon into small pieces (if using salo, cut into very small cubes)",
                "In a non-stick pan over MEDIUM heat, fry bacon until crispy and fat is rendered (about 4-5 minutes)",
                "Add chopped onion to the pan with the bacon fat, fry until soft and translucent (2-3 minutes)",
                "Add diced tomato, cook for 1 minute until slightly softened",
                "Meanwhile, crack eggs into a bowl, whisk with a pinch of salt and pepper",
                "Pour eggs into the pan over the bacon-onion-tomato mixture",
                "Stir gently with a spatula, cooking until eggs are just set but still slightly creamy (2-3 minutes)",
                "Remove from heat immediately (eggs continue cooking from residual heat)",
                "Serve hot, garnished with fresh chopped dill if available"
            ],
            
            tips: [
                "🇺🇦 Salo (cured pork fat) is very traditional in Ukraine - ask for it at Eastern European shops!",
                "🧅 Don't skip the onion - it adds authentic Ukrainian flavor",
                "🌿 Fresh dill is a must in Ukrainian cooking - it transforms this dish",
                "🍞 Serve with dark rye bread (Ukrainian style) or regular toast",
                "🔥 Don't overcook eggs - they should be soft and creamy, not dry"
            ],
            
            video: "https://www.youtube.com/watch?v=R1vNHvH6bW8",
            nutrition: "Per serving: 340 cal, 24g protein, 26g fat, 4g carbs"
        }
    },
    
    // === INTERNATIONAL BREAKFAST #4 ===
    R4: {
        id: "R4",
        name: "Classic Scrambled Eggs",
        category: "breakfast",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "5 mins",
        
        aiPrompt: "eggs:3, butter:20g",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "British Barn Eggs", qtyNeeded: 3, unit: "eggs" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "BUTTERPAK", qtyNeeded: 20, unit: "g" }
        ],
        
        display: {
            emoji: "🍳",
            description: "Perfect creamy scrambled eggs cooked low and slow",
            
            ingredients: [
                "3 large eggs",
                "20g butter",
                "Pinch of salt",
                "Freshly ground black pepper"
            ],
            
            instructions: [
                "Crack eggs into a bowl and whisk thoroughly with a pinch of salt",
                "Heat pan over LOW-MEDIUM heat - this is crucial for creamy eggs",
                "Add butter and let it melt completely, swirling to coat the pan",
                "Pour in eggs and let them sit undisturbed for 20 seconds",
                "Using a silicone spatula, gently push eggs from edges toward center",
                "Continue stirring slowly, creating soft curds",
                "Remove from heat when eggs are STILL SLIGHTLY WET",
                "Season with pepper and serve immediately on warm toast"
            ],
            
            tips: [
                "🔥 Low heat is the secret - don't rush!",
                "⏱️ Remove from heat before fully cooked",
                "🧀 Add cream cheese in last 30 seconds for extra richness",
                "🌿 Garnish with chives"
            ],
            
            video: "https://www.youtube.com/watch?v=R1vNHvH6bW8",
            nutrition: "Per serving: 280 cal, 18g protein, 22g fat"
        }
    },
    
    // === INTERNATIONAL BREAKFAST #5 ===
    R5: {
        id: "R5",
        name: "Porridge Oats with Honey",
        category: "breakfast",
        serves: 1,
        prepTime: "2 mins",
        cookTime: "5 mins",
        
        aiPrompt: "oats:50g, milk:200ml, honey:15g",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "Milk (Semi-Skimmed)", qtyNeeded: 0.2, unit: "L" }
        ],
        
        display: {
            emoji: "🥣",
            description: "Warming porridge with honey - quick, healthy, filling",
            
            ingredients: [
                "50g porridge oats",
                "200ml semi-skimmed milk",
                "15g honey",
                "Pinch of salt",
                "Optional: berries, banana, cinnamon"
            ],
            
            instructions: [
                "Pour milk into a small pot with pinch of salt",
                "Add oats and stir",
                "Heat on medium, stirring frequently for 5 minutes until thick and creamy",
                "Remove from heat, transfer to bowl",
                "Drizzle honey on top",
                "Add fruit or toppings if desired",
                "Serve hot"
            ],
            
            tips: [
                "🥛 Use half milk, half water for lighter version",
                "🍯 Maple syrup works instead of honey",
                "🍌 Mash banana into the oats while cooking for natural sweetness",
                "⏱️ Make overnight oats - soak oats in milk in fridge overnight, eat cold"
            ],
            
            video: "https://www.youtube.com/watch?v=nRnhRKK5oMo",
            nutrition: "Per serving: 290 cal, 11g protein, 5g fat, 48g carbs"
        }
    },
    
    // === INTERNATIONAL BREAKFAST #6 ===
    R6: {
        id: "R6",
        name: "Toast with Butter & Jam",
        category: "breakfast",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "2 mins",
        
        aiPrompt: "bread:2, butter:15g",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🍞 Bread & Bakery", itemName: "White Toastie Bread Thick Sliced", qtyNeeded: 2, unit: "slices" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "BUTTERPAK", qtyNeeded: 15, unit: "g" }
        ],
        
        display: {
            emoji: "🍞",
            description: "Simple classic toast - quick and satisfying",
            
            ingredients: [
                "2 slices thick white bread",
                "15g butter",
                "Jam (your choice)"
            ],
            
            instructions: [
                "Toast bread until golden",
                "Spread butter while toast is hot so it melts",
                "Add jam on top",
                "Serve immediately"
            ],
            
            tips: [
                "🧈 Real butter tastes much better than margarine",
                "🍓 Strawberry, raspberry, or apricot jam are classics",
                "🥜 Try peanut butter instead for protein"
            ],
            
            video: "",
            nutrition: "Per serving: 220 cal, 5g protein, 8g fat, 32g carbs"
        }
    },
    
    // === INTERNATIONAL BREAKFAST #7 ===
    R7: {
        id: "R7",
        name: "Avocado Toast",
        category: "breakfast",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "2 mins",
        
        aiPrompt: "bread:2, avocado:1, tomato:1",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: true
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🍞 Bread & Bakery", itemName: "White Toastie Bread Thick Sliced", qtyNeeded: 2, unit: "slices" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Tomatoes", qtyNeeded: 0.1, unit: "kg" }
        ],
        
        display: {
            emoji: "🥑",
            description: "Trendy and healthy - creamy avocado on crispy toast",
            
            ingredients: [
                "2 slices bread",
                "1 ripe avocado",
                "1 small tomato, sliced",
                "Salt, pepper, chili flakes",
                "Optional: lemon juice"
            ],
            
            instructions: [
                "Toast bread until crispy",
                "Halve avocado, remove pit, scoop flesh into bowl",
                "Mash avocado with fork, add pinch of salt and squeeze of lemon",
                "Spread mashed avocado on toast",
                "Top with tomato slices",
                "Season with salt, pepper, and chili flakes",
                "Serve immediately"
            ],
            
            tips: [
                "🥑 Avocado should be ripe - yields to gentle pressure",
                "🍋 Lemon juice prevents avocado browning",
                "🌶️ Add chili flakes for a kick",
                "🥚 Top with poached egg for protein boost"
            ],
            
            video: "https://www.youtube.com/watch?v=SFWjT2lWQVk",
            nutrition: "Per serving: 310 cal, 7g protein, 18g fat, 32g carbs"
        }
    },
    
    // === INTERNATIONAL BREAKFAST #8 ===
    R8: {
        id: "R8",
        name: "Yogurt with Berries & Honey",
        category: "breakfast",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "0 mins",
        
        aiPrompt: "yogurt:200g, honey:15g",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "Milk (Semi-Skimmed)", qtyNeeded: 0.2, unit: "L" }
        ],
        
        display: {
            emoji: "🥄",
            description: "Light and refreshing - Greek yogurt with fresh berries",
            
            ingredients: [
                "200g Greek yogurt",
                "15g honey",
                "Fresh berries (strawberries, blueberries)",
                "Optional: granola, nuts"
            ],
            
            instructions: [
                "Spoon yogurt into a bowl",
                "Wash and slice berries if needed",
                "Top yogurt with berries",
                "Drizzle honey over the top",
                "Add granola or nuts if using",
                "Serve immediately"
            ],
            
            tips: [
                "🍓 Frozen berries work great - cheaper and last longer",
                "🍯 Maple syrup or agave instead of honey",
                "🥜 Add almonds or walnuts for crunch",
                "💪 Greek yogurt has more protein than regular"
            ],
            
            video: "",
            nutrition: "Per serving: 220 cal, 15g protein, 5g fat, 28g carbs"
        }
    },
    
    // === INTERNATIONAL BREAKFAST #9 ===
    R9: {
        id: "R9",
        name: "Banana Smoothie",
        category: "breakfast",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "0 mins",
        
        aiPrompt: "banana:1, milk:250ml, oats:30g",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🍎 Fruits", itemName: "Banana Loose", qtyNeeded: 0.15, unit: "kg" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "Milk (Semi-Skimmed)", qtyNeeded: 0.25, unit: "L" }
        ],
        
        display: {
            emoji: "🥤",
            description: "Quick energy boost - creamy banana smoothie with oats",
            
            ingredients: [
                "1 ripe banana",
                "250ml milk",
                "30g oats",
                "Optional: honey, cinnamon, ice"
            ],
            
            instructions: [
                "Peel banana and break into chunks",
                "Add all ingredients to blender",
                "Blend on high for 30-60 seconds until smooth",
                "Add ice if you want it cold and thick",
                "Pour into glass and drink immediately"
            ],
            
            tips: [
                "🍌 Frozen banana makes it thicker and colder",
                "🥛 Almond milk works for dairy-free version",
                "🍫 Add cocoa powder for chocolate smoothie",
                "💪 Add protein powder for post-workout"
            ],
            
            video: "https://www.youtube.com/watch?v=rXS48a3tYBg",
            nutrition: "Per serving: 310 cal, 12g protein, 5g fat, 55g carbs"
        }
    },
    
    // === INTERNATIONAL BREAKFAST #10 ===
    R10: {
        id: "R10",
        name: "Boiled Eggs with Toast",
        category: "breakfast",
        serves: 1,
        prepTime: "2 mins",
        cookTime: "8 mins",
        
        aiPrompt: "eggs:2, bread:2, butter:10g",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "British Barn Eggs", qtyNeeded: 2, unit: "eggs" },
            { shop: "Tesco", category: "🍞 Bread & Bakery", itemName: "White Toastie Bread Thick Sliced", qtyNeeded: 2, unit: "slices" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "BUTTERPAK", qtyNeeded: 10, unit: "g" }
        ],
        
        display: {
            emoji: "🥚",
            description: "Classic protein breakfast - perfectly boiled eggs with soldiers",
            
            ingredients: [
                "2 large eggs",
                "2 slices bread",
                "10g butter",
                "Salt and pepper"
            ],
            
            instructions: [
                "Bring a small pot of water to rolling boil",
                "Gently lower eggs into water with a spoon",
                "Boil for 6-7 minutes for soft yolk, 9-10 for hard",
                "While eggs cook, toast bread and butter it",
                "When eggs done, run under cold water for 30 seconds",
                "Peel eggs, cut in half, season with salt and pepper",
                "Serve with toast"
            ],
            
            tips: [
                "⏱️ 6 min = runny yolk, 7 min = jammy, 9 min = fully cooked",
                "🧊 Ice bath makes peeling easier",
                "🍞 Cut toast into strips (soldiers) for dipping",
                "🧂 Season generously - eggs love salt!"
            ],
            
            video: "https://www.youtube.com/watch?v=SmyZJdX4grs",
            nutrition: "Per serving: 320 cal, 16g protein, 16g fat, 28g carbs"
        }
    },
    
    // ===================================
    // BATCH COOK RECIPES (R11-R30)
    // ===================================
    
    // === UKRAINIAN BATCH #1 ===
    R11: {
        id: "R11",
        name: "Borscht (Ukrainian Beet Soup)",
        category: "batch",
        serves: 4,
        prepTime: "20 mins",
        cookTime: "45 mins",
        
        aiPrompt: "beets:400g, cabbage:200g, potatoes:300g, carrots:150g, onion:100g, tomato_paste:50g, vegetable_stock:1.5L",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "All Rounder Potatoes", qtyNeeded: 0.3, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.1, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Carrots", qtyNeeded: 0.15, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Tomatoes", qtyNeeded: 0.1, unit: "kg" },
            { shop: "Tesco", category: "🥫 Canned & Packaged", itemName: "Grower's Harvest Chopped Tomatoes", qtyNeeded: 1, unit: "tin" }
        ],
        
        display: {
            emoji: "🥣",
            description: "The queen of Ukrainian soups! Vibrant beet soup with vegetables, served with sour cream and dark bread. Healthy, delicious, and authentically Ukrainian!",
            
            ingredients: [
                "400g beetroots (about 2-3 medium), peeled and grated or julienned",
                "200g white cabbage, thinly sliced",
                "300g potatoes (2 medium), peeled and cubed",
                "150g carrots (1 large), grated",
                "100g onion (1 medium), finely chopped",
                "50g tomato paste",
                "1.5L vegetable stock (or water with 2 stock cubes)",
                "2 tablespoons vegetable oil",
                "2 bay leaves",
                "Salt and pepper to taste",
                "Fresh dill for garnish",
                "Sour cream for serving",
                "Optional: 1 tablespoon vinegar or lemon juice"
            ],
            
            instructions: [
                "PREPARE VEGETABLES: Peel and grate beetroots and carrots. Chop onion. Slice cabbage. Cube potatoes. This prep is important!",
                "START STOCK: In a large pot, bring 1.5L of vegetable stock to boil",
                "COOK POTATOES: Add cubed potatoes to boiling stock, cook for 10 minutes until almost tender",
                "SAUTÉ AROMATICS: While potatoes cook, heat oil in a large frying pan over medium heat",
                "FRY ONION & CARROT: Add chopped onion, cook 3 minutes until soft. Add grated carrot, cook 5 more minutes, stirring",
                "ADD BEETS: Add grated beetroot to the pan with onion-carrot mixture. Cook for 5-7 minutes, stirring occasionally",
                "ADD TOMATO PASTE: Stir in tomato paste to the beet mixture, cook for 2 minutes",
                "COMBINE: Transfer the entire beet-carrot-onion mixture from the pan into the pot with potatoes and stock",
                "ADD CABBAGE: Add sliced cabbage to the pot, stir well",
                "SIMMER: Add bay leaves, bring to boil, then reduce heat to low. Simmer for 20-25 minutes until all vegetables are tender",
                "SEASON: Taste and add salt and pepper. Add 1 tablespoon vinegar or lemon juice for traditional tangy flavor",
                "REST: Turn off heat and let borscht sit for 10 minutes - this allows flavors to develop",
                "SERVE: Ladle into bowls, top with generous dollop of sour cream and fresh chopped dill"
            ],
            
            tips: [
                "🇺🇦 AUTHENTIC TIP: Borscht tastes even better the next day - make it ahead!",
                "🔴 Keep the vibrant red color: add a splash of vinegar or lemon juice at the end",
                "🥄 Sour cream (smetana) is NOT optional in Ukrainian borscht - it's essential!",
                "🌿 Fresh dill is crucial - dried won't give the same authentic flavor",
                "🍞 Serve with dark rye bread and garlic - very traditional",
                "❄️ Borscht freezes beautifully - make a double batch!",
                "🥬 Some regions add beans or meat - this is the classic vegetarian version",
                "⏱️ Don't rush the cooking - low and slow develops the best flavor"
            ],
            
            video: "https://www.youtube.com/watch?v=x4c1JYw14dE",
            nutrition: "Per serving: 180 cal, 4g protein, 5g fat, 32g carbs"
        }
    },
    
    // === UKRAINIAN BATCH #2 ===
    R12: {
        id: "R12",
        name: "Varenyky (Ukrainian Dumplings with Potato)",
        category: "batch",
        serves: 4,
        prepTime: "45 mins",
        cookTime: "15 mins",
        
        aiPrompt: "flour:400g, eggs:2, potatoes:600g, onion:150g, butter:40g",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Flour (Plain)", qtyNeeded: 0.4, unit: "kg" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "British Barn Eggs", qtyNeeded: 2, unit: "eggs" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "All Rounder Potatoes", qtyNeeded: 0.6, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.15, unit: "kg" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "BUTTERPAK", qtyNeeded: 40, unit: "g" }
        ],
        
        display: {
            emoji: "🥟",
            description: "Traditional Ukrainian dumplings (like pierogi) filled with creamy mashed potato and fried onions. Served with sour cream and crispy onions on top!",
            
            ingredients: [
                "DOUGH:",
                "400g plain flour",
                "2 large eggs",
                "120ml warm water",
                "1 tablespoon vegetable oil",
                "½ teaspoon salt",
                "",
                "FILLING:",
                "600g potatoes, peeled and cubed",
                "150g onions (1 large), finely chopped",
                "40g butter",
                "Salt and pepper to taste",
                "",
                "TO SERVE:",
                "Butter for frying",
                "Extra fried onions",
                "Sour cream"
            ],
            
            instructions: [
                "MAKE FILLING FIRST: Boil potatoes in salted water for 15-20 minutes until very soft. Drain well.",
                "While potatoes cook, fry chopped onions in butter until golden brown (about 10 minutes). Set aside half for topping.",
                "Mash potatoes until very smooth (no lumps!). Mix in the fried onions (half), add butter, salt and pepper. Let cool completely.",
                "",
                "MAKE DOUGH: In a large bowl, mix flour and salt. Make a well in center.",
                "Beat eggs, add warm water and oil. Pour into the well.",
                "Mix with a fork, then knead with hands for 8-10 minutes until smooth and elastic (very important - dough should be soft but not sticky)",
                "Cover dough with a damp towel, rest for 30 minutes at room temperature",
                "",
                "ASSEMBLE VARENYKY: Roll dough out thinly (about 2mm) on floured surface",
                "Cut circles with a glass or cookie cutter (about 8cm diameter)",
                "Place 1 teaspoon of potato filling in center of each circle",
                "Fold in half to make a half-moon shape. Press edges firmly to seal - this is crucial!",
                "Crimp edges with a fork for extra seal and traditional look",
                "",
                "COOK: Bring a large pot of salted water to boil",
                "Gently drop varenyky in batches (don't overcrowd)",
                "They will sink first, then float to the top when ready (about 3-4 minutes after floating)",
                "Remove with slotted spoon, drain well",
                "",
                "SERVE: Melt butter in a pan, add boiled varenyky, fry for 2 minutes to get slight crisp",
                "Top with reserved fried onions and dollop of sour cream"
            ],
            
            tips: [
                "🇺🇦 IN UKRAINE: These are made for special occasions and family gathers to make them together!",
                "💪 Knead dough well - it makes it elastic so varenyky don't fall apart",
                "❄️ FREEZING: Freeze uncooked varenyky on a tray, then bag them. Cook from frozen (add 2 extra minutes)",
                "🧅 Fried onions on top are ESSENTIAL - don't skip!",
                "🥄 Sour cream is traditional - some add crispy bacon pieces too",
                "👵 Grandma's tip: Add a little mashed potato to the dough for extra soft varenyky",
                "⏱️ This recipe makes about 40 varenyky - freeze extras!",
                "🎨 Kids love helping to shape and crimp the edges"
            ],
            
            video: "https://www.youtube.com/watch?v=HJBzAu2mtoc",
            nutrition: "Per serving (10 varenyky): 480 cal, 12g protein, 14g fat, 75g carbs"
        }
    },
    
    // === UKRAINIAN BATCH #3 ===
    R13: {
        id: "R13",
        name: "Holubtsi (Stuffed Cabbage Rolls)",
        category: "batch",
        serves: 4,
        prepTime: "30 mins",
        cookTime: "60 mins",
        
        aiPrompt: "cabbage:1, rice:150g, beef_mince:300g, onion:100g, tomato_paste:50g, carrots:100g",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.1, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Carrots", qtyNeeded: 0.1, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Rice (Basmati)", qtyNeeded: 0.15, unit: "kg" },
            { shop: "Tesco", category: "🥫 Canned & Packaged", itemName: "Grower's Harvest Chopped Tomatoes", qtyNeeded: 1, unit: "tin" }
        ],
        
        display: {
            emoji: "🌯",
            description: "Classic Ukrainian comfort food - tender cabbage leaves stuffed with rice and meat, cooked in tomato sauce. Time-consuming but worth it!",
            
            ingredients: [
                "1 large cabbage head",
                "300g beef mince (or pork/chicken)",
                "150g white rice (uncooked)",
                "100g onion, finely chopped",
                "100g carrot, grated",
                "50g tomato paste",
                "400g tin chopped tomatoes",
                "2 bay leaves",
                "Salt, pepper, paprika",
                "2 tablespoons vegetable oil",
                "Optional: sour cream for serving"
            ],
            
            instructions: [
                "PREPARE CABBAGE: Bring large pot of water to boil. Core cabbage and place whole in boiling water for 5-7 minutes until outer leaves soften",
                "Carefully peel off softened leaves one by one (about 12 leaves needed). Cut out thick stem from each leaf. Set aside",
                "MAKE FILLING: Cook rice halfway (about 7 minutes). Drain and let cool slightly",
                "In a bowl, mix mince, half-cooked rice, half the chopped onion, salt, pepper, and paprika",
                "STUFF ROLLS: Place 2 tablespoons of filling on each cabbage leaf. Fold sides in, then roll up tightly like a burrito",
                "MAKE SAUCE: In a pan, fry remaining onion and grated carrot until soft. Add tomato paste, cook 2 minutes. Add tinned tomatoes, salt, pepper",
                "COOK HOLUBTSI: Pour thin layer of sauce in a large pot. Arrange cabbage rolls seam-side down in the pot, packing snugly",
                "Pour remaining sauce over rolls. Add bay leaves. Cover with lid",
                "Cook on LOW heat for 50-60 minutes until rice is fully cooked and meat is tender",
                "SERVE: Carefully remove holubtsi with a slotted spoon. Top with sauce and sour cream"
            ],
            
            tips: [
                "🇺🇦 Ukrainian grandmothers make huge batches and freeze them!",
                "🥬 Smaller cabbage leaves work better - easier to roll",
                "🍚 Don't fully cook the rice first - it finishes cooking in the pot",
                "❄️ Freeze uncooked rolls and cook later - saves time!",
                "🥄 Sour cream is traditional but not required",
                "⏱️ Low and slow cooking is essential - don't rush!"
            ],
            
            video: "https://www.youtube.com/watch?v=xR8DVDOLyO8",
            nutrition: "Per serving (3 rolls): 420 cal, 22g protein, 12g fat, 52g carbs"
        }
    },
    
    // === UKRAINIAN BATCH #4 ===
    R14: {
        id: "R14",
        name: "Deruny (Ukrainian Potato Pancakes)",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "30 mins",
        
        aiPrompt: "potatoes:800g, eggs:2, flour:40g, onion:100g, oil:100ml",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: true
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "All Rounder Potatoes", qtyNeeded: 0.8, unit: "kg" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "British Barn Eggs", qtyNeeded: 2, unit: "eggs" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.1, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Flour (Plain)", qtyNeeded: 0.04, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Vegetable Oil", qtyNeeded: 0.1, unit: "L" }
        ],
        
        display: {
            emoji: "🥔",
            description: "Crispy on outside, soft inside - traditional Ukrainian potato pancakes. Simple ingredients, maximum flavor!",
            
            ingredients: [
                "800g potatoes, peeled",
                "100g onion (1 medium)",
                "2 large eggs",
                "40g plain flour",
                "1 teaspoon salt",
                "½ teaspoon black pepper",
                "100ml vegetable oil for frying",
                "Sour cream for serving"
            ],
            
            instructions: [
                "Grate potatoes on the finest grater holes into a large bowl",
                "Grate onion and add to potatoes",
                "IMPORTANT: Squeeze out excess liquid from potato mixture with your hands or through a cheesecloth - this makes them crispy!",
                "Add eggs, flour, salt, and pepper to the squeezed potato mixture. Mix well",
                "Heat oil in a large frying pan over MEDIUM-HIGH heat",
                "Take a large spoonful of mixture, flatten slightly, place in hot oil",
                "Fry for 4-5 minutes on each side until golden brown and crispy",
                "Drain on paper towels",
                "Serve hot with sour cream"
            ],
            
            tips: [
                "🇺🇦 Classic Ukrainian comfort food - every family has their own recipe!",
                "💧 Squeezing out liquid is THE secret to crispy deruny",
                "🔥 Oil should be hot enough that mixture sizzles when added",
                "🥄 Serve immediately - they're best fresh and hot",
                "❄️ Can reheat in oven at 180°C for 10 minutes",
                "🧅 Don't skip the onion - it adds essential flavor"
            ],
            
            video: "https://www.youtube.com/watch?v=76JXtB7JFQY",
            nutrition: "Per serving: 380 cal, 8g protein, 18g fat, 48g carbs"
        }
    },
    
    // === UKRAINIAN BATCH #5 ===
    R15: {
        id: "R15",
        name: "Ukrainian Chicken & Rice (Plov Style)",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "45 mins",
        
        aiPrompt: "chicken:500g, rice:300g, carrots:200g, onion:150g, garlic:20g",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🍖 Meat & Fish", itemName: "Chicken Breast", qtyNeeded: 0.5, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Rice (Basmati)", qtyNeeded: 0.3, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Carrots", qtyNeeded: 0.2, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.15, unit: "kg" }
        ],
        
        display: {
            emoji: "🍚",
            description: "Ukrainian one-pot wonder - chicken and rice cooked together with carrots and spices. Simple, filling, delicious!",
            
            ingredients: [
                "500g chicken breast, cubed",
                "300g white rice",
                "200g carrots, julienned",
                "150g onion, chopped",
                "20g garlic (4-5 cloves), minced",
                "600ml chicken stock",
                "3 tablespoons vegetable oil",
                "1 teaspoon cumin",
                "1 teaspoon paprika",
                "2 bay leaves",
                "Salt and pepper"
            ],
            
            instructions: [
                "Heat oil in a large deep pan or pot over medium-high heat",
                "Add chicken pieces, cook until browned (5 minutes). Remove and set aside",
                "In same pan, add onion and carrot. Cook for 7-8 minutes until soft and golden",
                "Add garlic, cumin, and paprika. Cook for 1 minute until fragrant",
                "Return chicken to pan. Add rice, stir to coat in oil and spices",
                "Pour in stock, add bay leaves, salt, and pepper",
                "Bring to boil, then reduce heat to LOW",
                "Cover tightly with lid and cook for 20 minutes WITHOUT lifting the lid",
                "Turn off heat, let sit for 10 minutes (still covered)",
                "Fluff with fork and serve"
            ],
            
            tips: [
                "🇺🇦 Similar to Central Asian plov but Ukrainian style - simpler!",
                "🚫 DON'T lift the lid while cooking - steam is essential",
                "🥕 Julienned carrots are traditional - they add color and sweetness",
                "🧄 Garlic is key - don't skip it!",
                "❄️ Reheats beautifully - add splash of water when reheating",
                "🥬 Serve with fresh salad or pickles"
            ],
            
            video: "https://www.youtube.com/watch?v=BJcu7x5FPy8",
            nutrition: "Per serving: 520 cal, 35g protein, 12g fat, 65g carbs"
        }
    },
    
    // === INTERNATIONAL BATCH #6 ===
    R16: {
        id: "R16",
        name: "Spaghetti Bolognese",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "45 mins",
        
        aiPrompt: "beef_mince:500g, pasta:400g, onion:100g, garlic:15g, tomatoes:800g",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: true
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.1, unit: "kg" },
            { shop: "Tesco", category: "🥫 Canned & Packaged", itemName: "Grower's Harvest Chopped Tomatoes", qtyNeeded: 2, unit: "tin" }
        ],
        
        display: {
            emoji: "🍝",
            description: "Classic Italian meat sauce with spaghetti - family favorite!",
            
            ingredients: [
                "500g beef mince",
                "400g spaghetti",
                "100g onion, chopped",
                "15g garlic (3 cloves), minced",
                "800g tinned tomatoes",
                "2 tablespoons tomato paste",
                "1 teaspoon dried oregano",
                "1 teaspoon dried basil",
                "Salt, pepper, sugar",
                "Olive oil"
            ],
            
            instructions: [
                "Heat oil in large pan, add onion, cook until soft",
                "Add garlic, cook 1 minute",
                "Add mince, break up with spoon, cook until browned",
                "Add tomatoes, tomato paste, herbs, salt, pepper, pinch of sugar",
                "Simmer on low for 30-40 minutes, stirring occasionally",
                "Meanwhile, cook spaghetti according to package",
                "Drain pasta, serve with sauce on top"
            ],
            
            tips: [
                "🍷 Add splash of red wine for depth",
                "🧀 Top with Parmesan cheese",
                "❄️ Sauce freezes perfectly",
                "⏱️ Longer simmering = better flavor"
            ],
            
            video: "https://www.youtube.com/watch?v=vnsnCPMmZKg",
            nutrition: "Per serving: 550 cal, 32g protein, 12g fat, 75g carbs"
        }
    },
    
    // === INTERNATIONAL BATCH #7 ===
    R17: {
        id: "R17",
        name: "Chicken Curry with Rice",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "35 mins",
        
        aiPrompt: "chicken:600g, rice:300g, onion:150g, curry_powder:30g, coconut_milk:400ml",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        quickAddItems: [
            { shop: "Tesco", category: "🍖 Meat & Fish", itemName: "Chicken Breast", qtyNeeded: 0.6, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Rice (Basmati)", qtyNeeded: 0.3, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.15, unit: "kg" }
        ],
        
        display: {
            emoji: "🍛",
            description: "Creamy chicken curry - mild and family-friendly",
            
            ingredients: [
                "600g chicken breast, cubed",
                "300g rice",
                "150g onion, chopped",
                "2 tablespoons curry powder",
                "400ml coconut milk",
                "2 tablespoons tomato paste",
                "Garlic, ginger",
                "Oil, salt"
            ],
            
            instructions: [
                "Cook rice according to package",
                "Heat oil, fry onion until soft",
                "Add garlic, ginger, curry powder, cook 1 minute",
                "Add chicken, cook until sealed",
                "Add tomato paste and coconut milk",
                "Simmer 20 minutes until chicken cooked through",
                "Serve curry over rice"
            ],
            
            tips: [
                "🌶️ Add chili for spice",
                "🥬 Add vegetables - peas, peppers",
                "🥥 Coconut milk makes it creamy",
                "🍚 Serve with naan bread"
            ],
            
            video: "https://www.youtube.com/watch?v=fhcQwTdp7gU",
            nutrition: "Per serving: 580 cal, 38g protein, 18g fat, 62g carbs"
        }
    },
    
    R18: {
        id: "R18",
        name: "Chili Con Carne",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "40 mins",
        aiPrompt: "beef_mince:500g, beans:800g, tomatoes:400g, onion:100g, rice:300g",
        dietary: { vegetarian: false, vegan: false, nuts: false, dairy: false, gluten: false },
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.1, unit: "kg" },
            { shop: "Tesco", category: "🥫 Canned & Packaged", itemName: "Grower's Harvest Chopped Tomatoes", qtyNeeded: 1, unit: "tin" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Rice (Basmati)", qtyNeeded: 0.3, unit: "kg" }
        ],
        display: {
            emoji: "🌶️",
            description: "Spicy beef and bean stew served with rice",
            ingredients: ["500g beef mince", "800g tinned kidney beans", "400g tinned tomatoes", "100g onion", "300g rice", "Chili powder, cumin", "Salt, pepper"],
            instructions: ["Fry onion and mince", "Add spices, cook 1 min", "Add tomatoes and beans", "Simmer 30 mins", "Cook rice separately", "Serve chili over rice"],
            tips: ["🌶️ Adjust chili to taste", "🧀 Top with cheese and sour cream", "❄️ Freezes well"],
            video: "https://www.youtube.com/watch?v=c1s8EDSfO5k",
            nutrition: "Per serving: 520 cal, 35g protein, 10g fat, 70g carbs"
        }
    },

    R19: {
        id: "R19",
        name: "Vegetable Stir Fry",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "15 mins",
        aiPrompt: "rice:300g, mixed_veg:600g, soy_sauce:50ml, garlic:15g, ginger:10g",
        dietary: { vegetarian: true, vegan: true, nuts: false, dairy: false, gluten: false },
        quickAddItems: [
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Rice (Basmati)", qtyNeeded: 0.3, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Carrots", qtyNeeded: 0.2, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Broccoli", qtyNeeded: 0.2, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.1, unit: "kg" }
        ],
        display: {
            emoji: "🥦",
            description: "Colorful vegetable stir fry with rice - quick and healthy",
            ingredients: ["300g rice", "600g mixed vegetables (broccoli, carrots, peppers)", "50ml soy sauce", "Garlic, ginger", "Oil"],
            instructions: ["Cook rice", "Heat wok/pan high heat", "Stir fry veg 5-7 mins", "Add garlic, ginger, soy sauce", "Serve over rice"],
            tips: ["🔥 Keep heat HIGH", "🥢 Don't overcook veg - keep crisp", "🥜 Add cashews for protein"],
            video: "https://www.youtube.com/watch?v=qH__o17xHls",
            nutrition: "Per serving: 320 cal, 8g protein, 4g fat, 65g carbs"
        }
    },

    R20: {
        id: "R20",
        name: "Pasta Bake",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "35 mins",
        aiPrompt: "pasta:400g, cheese:200g, tomatoes:400g, mince:300g",
        dietary: { vegetarian: false, vegan: false, nuts: false, dairy: true, gluten: true },
        quickAddItems: [
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Pasta (Spaghetti)", qtyNeeded: 0.4, unit: "kg" },
            { shop: "Tesco", category: "🥫 Canned & Packaged", itemName: "Grower's Harvest Chopped Tomatoes", qtyNeeded: 1, unit: "tin" }
        ],
        display: {
            emoji: "🍝",
            description: "Cheesy pasta bake - comfort food favorite",
            ingredients: ["400g pasta", "200g cheese", "400g tomatoes", "300g mince", "Onion, garlic"],
            instructions: ["Cook pasta 2 mins less than package", "Make meat sauce", "Mix pasta with sauce", "Top with cheese", "Bake 20 mins at 180°C"],
            tips: ["🧀 Mix cheese types", "❄️ Freeze before baking", "🥬 Add vegetables"],
            video: "https://www.youtube.com/watch?v=TFj62I0YhxY",
            nutrition: "Per serving: 580 cal, 28g protein, 18g fat, 72g carbs"
        }
    },

    R21: {
        id: "R21",
        name: "Fish & Chips",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "30 mins",
        aiPrompt: "white_fish:600g, potatoes:800g, oil:200ml, flour:100g",
        dietary: { vegetarian: false, vegan: false, nuts: false, dairy: false, gluten: true },
        quickAddItems: [
            { shop: "Tesco", category: "🍖 Meat & Fish", itemName: "White Fish", qtyNeeded: 0.6, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "All Rounder Potatoes", qtyNeeded: 0.8, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Flour (Plain)", qtyNeeded: 0.1, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Vegetable Oil", qtyNeeded: 0.2, unit: "L" }
        ],
        display: {
            emoji: "🐟",
            description: "British classic - crispy battered fish with chunky chips",
            ingredients: ["600g white fish fillets", "800g potatoes", "100g flour", "Oil for frying", "Salt, vinegar"],
            instructions: ["Cut potatoes into chips", "Fry chips in hot oil until golden", "Make batter with flour and water", "Coat fish in batter", "Fry fish 4-5 mins per side", "Serve with peas"],
            tips: ["🔥 Oil must be hot - 180°C", "🧂 Season chips immediately", "🍋 Serve with lemon wedges"],
            video: "https://www.youtube.com/watch?v=w58GfJLNraQ",
            nutrition: "Per serving: 520 cal, 32g protein, 22g fat, 48g carbs"
        }
    },

    R22: {
        id: "R22",
        name: "Chicken Fried Rice",
        category: "batch",
        serves: 4,
        prepTime: "10 mins",
        cookTime: "15 mins",
        aiPrompt: "chicken:400g, rice:300g, eggs:3, mixed_veg:200g, soy_sauce:40ml",
        dietary: { vegetarian: false, vegan: false, nuts: false, dairy: false, gluten: false },
        quickAddItems: [
            { shop: "Tesco", category: "🍖 Meat & Fish", itemName: "Chicken Breast", qtyNeeded: 0.4, unit: "kg" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Rice (Basmati)", qtyNeeded: 0.3, unit: "kg" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "British Barn Eggs", qtyNeeded: 3, unit: "eggs" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Carrots", qtyNeeded: 0.1, unit: "kg" }
        ],
        display: {
            emoji: "🍚",
            description: "Better than takeaway - chicken fried rice made at home",
            ingredients: ["400g chicken", "300g cooked rice (day-old works best)", "3 eggs", "200g mixed veg", "Soy sauce, garlic"],
            instructions: ["Cook and cool rice (or use leftover)", "Scramble eggs, set aside", "Fry chicken, set aside", "Fry veg", "Add rice, chicken, eggs", "Add soy sauce, mix well"],
            tips: ["🍚 Day-old rice is best - less sticky", "🔥 Keep heat HIGH", "🥢 Use sesame oil for authentic flavor"],
            video: "https://www.youtube.com/watch?v=bjmYkPkjnVo",
            nutrition: "Per serving: 480 cal, 32g protein, 12g fat, 58g carbs"
        }
    },

    R23: {
        id: "R23",
        name: "Beef Stew",
        category: "batch",
        serves: 4,
        prepTime: "20 mins",
        cookTime: "90 mins",
        aiPrompt: "beef:600g, potatoes:400g, carrots:300g, onion:150g, stock:1L",
        dietary: { vegetarian: false, vegan: false, nuts: false, dairy: false, gluten: false },
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "All Rounder Potatoes", qtyNeeded: 0.4, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Carrots", qtyNeeded: 0.3, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.15, unit: "kg" }
        ],
        display: {
            emoji: "🍲",
            description: "Hearty beef stew - perfect for cold days",
            ingredients: ["600g beef chunks", "400g potatoes", "300g carrots", "150g onion", "1L beef stock", "Herbs, salt, pepper"],
            instructions: ["Brown beef in batches", "Fry onion", "Add all ingredients to pot", "Bring to boil", "Simmer LOW 90 mins until tender", "Serve with bread"],
            tips: ["⏱️ Low and slow = tender meat", "🍷 Add red wine for depth", "❄️ Freezes perfectly"],
            video: "https://www.youtube.com/watch?v=S94Qrw9WwXw",
            nutrition: "Per serving: 420 cal, 38g protein, 12g fat, 38g carbs"
        }
    },

    R24: {
        id: "R24",
        name: "Vegetable Soup",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "30 mins",
        aiPrompt: "mixed_veg:800g, stock:1.5L, onion:100g, garlic:10g",
        dietary: { vegetarian: true, vegan: true, nuts: false, dairy: false, gluten: false },
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Carrots", qtyNeeded: 0.3, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "All Rounder Potatoes", qtyNeeded: 0.3, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.1, unit: "kg" },
            { shop: "Tesco", category: "🥫 Canned & Packaged", itemName: "Grower's Harvest Chopped Tomatoes", qtyNeeded: 1, unit: "tin" }
        ],
        display: {
            emoji: "🥣",
            description: "Warming vegetable soup - healthy and filling",
            ingredients: ["800g mixed vegetables", "1.5L vegetable stock", "100g onion", "Garlic", "Herbs"],
            instructions: ["Chop all veg", "Fry onion and garlic", "Add veg and stock", "Simmer 25 mins", "Blend if desired", "Season and serve"],
            tips: ["🥬 Use any vegetables", "🌿 Fresh herbs transform it", "🍞 Serve with crusty bread"],
            video: "https://www.youtube.com/watch?v=z0WaWbWl-r8",
            nutrition: "Per serving: 180 cal, 5g protein, 2g fat, 35g carbs"
        }
    },

    R25: {
        id: "R25",
        name: "Shepherd's Pie",
        category: "batch",
        serves: 4,
        prepTime: "20 mins",
        cookTime: "45 mins",
        aiPrompt: "lamb_mince:500g, potatoes:800g, carrots:200g, onion:100g, peas:150g",
        dietary: { vegetarian: false, vegan: false, nuts: false, dairy: true, gluten: false },
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "All Rounder Potatoes", qtyNeeded: 0.8, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Carrots", qtyNeeded: 0.2, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.1, unit: "kg" },
            { shop: "Tesco", category: "🧊 Frozen", itemName: "Frozen Peas", qtyNeeded: 0.15, unit: "kg" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "BUTTERPAK", qtyNeeded: 30, unit: "g" }
        ],
        display: {
            emoji: "🥧",
            description: "British classic - minced lamb with mashed potato topping",
            ingredients: ["500g lamb mince", "800g potatoes", "200g carrots", "100g onion", "150g peas", "Butter, stock"],
            instructions: ["Boil and mash potatoes", "Fry mince with onion and veg", "Add stock, simmer 15 mins", "Put meat in dish", "Top with mash", "Bake 25 mins at 200°C"],
            tips: ["🥔 Make mash creamy with butter and milk", "🧀 Grate cheese on top", "❄️ Freezes well before baking"],
            video: "https://www.youtube.com/watch?v=Q98EnhtqcrQ",
            nutrition: "Per serving: 520 cal, 28g protein, 22g fat, 52g carbs"
        }
    },

    R26: {
        id: "R26",
        name: "Chicken Noodle Soup",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "30 mins",
        aiPrompt: "chicken:400g, noodles:200g, carrots:150g, celery:100g, stock:1.5L",
        dietary: { vegetarian: false, vegan: false, nuts: false, dairy: false, gluten: true },
        quickAddItems: [
            { shop: "Tesco", category: "🍖 Meat & Fish", itemName: "Chicken Breast", qtyNeeded: 0.4, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Carrots", qtyNeeded: 0.15, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.05, unit: "kg" }
        ],
        display: {
            emoji: "🍜",
            description: "Comforting chicken noodle soup - good for the soul",
            ingredients: ["400g chicken", "200g noodles", "150g carrots", "100g celery", "1.5L stock", "Garlic, herbs"],
            instructions: ["Boil stock", "Add chicken, cook 15 mins", "Remove chicken, shred", "Add veg to stock, cook 10 mins", "Add noodles and chicken back", "Season and serve"],
            tips: ["🌿 Fresh parsley is essential", "🍋 Squeeze lemon before serving", "🍞 Serve with bread"],
            video: "https://www.youtube.com/watch?v=JzvXzrgIDmQ",
            nutrition: "Per serving: 320 cal, 28g protein, 5g fat, 38g carbs"
        }
    },

    R27: {
        id: "R27",
        name: "Tuna Pasta Bake",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "30 mins",
        aiPrompt: "pasta:400g, tuna:400g, cheese:150g, tomatoes:400g",
        dietary: { vegetarian: false, vegan: false, nuts: false, dairy: true, gluten: true },
        quickAddItems: [
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Pasta (Spaghetti)", qtyNeeded: 0.4, unit: "kg" },
            { shop: "Tesco", category: "🥫 Canned & Packaged", itemName: "Grower's Harvest Chopped Tomatoes", qtyNeeded: 1, unit: "tin" }
        ],
        display: {
            emoji: "🐟",
            description: "Easy tuna pasta bake - budget-friendly and tasty",
            ingredients: ["400g pasta", "400g tinned tuna", "150g cheese", "400g tinned tomatoes", "Onion, garlic"],
            instructions: ["Cook pasta", "Make tomato sauce with onion and garlic", "Mix pasta, tuna, sauce", "Put in baking dish", "Top with cheese", "Bake 20 mins at 180°C"],
            tips: ["🧀 Mix mozzarella and cheddar", "🥬 Add sweetcorn or peas", "🌶️ Add chili flakes"],
            video: "https://www.youtube.com/watch?v=mBqE9Zy5CZg",
            nutrition: "Per serving: 520 cal, 32g protein, 12g fat, 68g carbs"
        }
    },

    R28: {
        id: "R28",
        name: "Chickpea Curry",
        category: "batch",
        serves: 4,
        prepTime: "10 mins",
        cookTime: "25 mins",
        aiPrompt: "chickpeas:800g, tomatoes:400g, onion:150g, curry_powder:30g, rice:300g",
        dietary: { vegetarian: true, vegan: true, nuts: false, dairy: false, gluten: false },
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.15, unit: "kg" },
            { shop: "Tesco", category: "🥫 Canned & Packaged", itemName: "Grower's Harvest Chopped Tomatoes", qtyNeeded: 1, unit: "tin" },
            { shop: "Tesco", category: "🚀 Pantry & Staples", itemName: "Rice (Basmati)", qtyNeeded: 0.3, unit: "kg" }
        ],
        display: {
            emoji: "🫘",
            description: "Vegan-friendly chickpea curry - protein-packed and delicious",
            ingredients: ["800g tinned chickpeas", "400g tinned tomatoes", "150g onion", "Curry powder", "300g rice", "Coconut milk"],
            instructions: ["Fry onion with curry powder", "Add tomatoes and chickpeas", "Add coconut milk", "Simmer 20 mins", "Cook rice", "Serve curry over rice"],
            tips: ["🥥 Coconut milk makes it creamy", "🌿 Add spinach for greens", "🌶️ Adjust spice level"],
            video: "https://www.youtube.com/watch?v=56Zn7w_6jiU",
            nutrition: "Per serving: 420 cal, 15g protein, 8g fat, 72g carbs"
        }
    },

    R29: {
        id: "R29",
        name: "Sausage & Mash",
        category: "batch",
        serves: 4,
        prepTime: "10 mins",
        cookTime: "30 mins",
        aiPrompt: "sausages:8, potatoes:800g, onion:150g, gravy:400ml",
        dietary: { vegetarian: false, vegan: false, nuts: false, dairy: true, gluten: false },
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "All Rounder Potatoes", qtyNeeded: 0.8, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.15, unit: "kg" },
            { shop: "Tesco", category: "🥛 Dairy & Eggs", itemName: "BUTTERPAK", qtyNeeded: 30, unit: "g" }
        ],
        display: {
            emoji: "🌭",
            description: "British comfort food - sausages with creamy mash and gravy",
            ingredients: ["8 sausages", "800g potatoes", "150g onion", "Gravy", "Butter, milk"],
            instructions: ["Grill sausages 20 mins", "Boil and mash potatoes with butter and milk", "Fry sliced onion until caramelized", "Make gravy", "Serve sausages on mash with onions and gravy"],
            tips: ["🧅 Caramelized onions are key", "🥔 Make mash super creamy", "🥬 Add peas on the side"],
            video: "https://www.youtube.com/watch?v=eD8Y31CIeXM",
            nutrition: "Per serving: 580 cal, 22g protein, 32g fat, 48g carbs"
        }
    },

    R30: {
        id: "R30",
        name: "Vegetable Lasagne",
        category: "batch",
        serves: 4,
        prepTime: "25 mins",
        cookTime: "45 mins",
        aiPrompt: "lasagne_sheets:250g, mixed_veg:600g, cheese:250g, tomatoes:800g",
        dietary: { vegetarian: true, vegan: false, nuts: false, dairy: true, gluten: true },
        quickAddItems: [
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "Carrots", qtyNeeded: 0.2, unit: "kg" },
            { shop: "Tesco", category: "🥬 Vegetables", itemName: "BRITISH BROWN ONIONS", qtyNeeded: 0.15, unit: "kg" },
            { shop: "Tesco", category: "🥫 Canned & Packaged", itemName: "Grower's Harvest Chopped Tomatoes", qtyNeeded: 2, unit: "tin" }
        ],
        display: {
            emoji: "🧀",
            description: "Layers of pasta, vegetables, and cheese - vegetarian comfort food",
            ingredients: ["250g lasagne sheets", "600g mixed vegetables", "250g cheese", "800g tinned tomatoes", "Onion, garlic"],
            instructions: ["Make vegetable tomato sauce", "Layer: sauce, lasagne, sauce, lasagne, repeat", "Top with cheese", "Cover with foil", "Bake 35 mins at 180°C", "Remove foil, bake 10 mins more"],
            tips: ["🧀 Mix mozzarella and cheddar", "🥬 Use courgette, peppers, spinach", "❄️ Freeze portions"],
            video: "https://www.youtube.com/watch?v=lVL0O4xtKXo",
            nutrition: "Per serving: 480 cal, 20g protein, 18g fat, 58g carbs"
        }
    }
    
};

// ===================================
// USER RECIPES (R50+)
// ===================================

let userRecipes = {};

// ===================================
// STORAGE FUNCTIONS
// ===================================

function loadUserRecipes() {
    const saved = localStorage.getItem('userRecipes');
    if (saved) {
        try {
            userRecipes = JSON.parse(saved);
            console.log(`Loaded ${Object.keys(userRecipes).length} custom recipes`);
        } catch (e) {
            console.error('Error loading user recipes:', e);
            userRecipes = {};
        }
    }
}

function saveUserRecipes() {
    localStorage.setItem('userRecipes', JSON.stringify(userRecipes));
    console.log(`Saved ${Object.keys(userRecipes).length} custom recipes`);
}

function getRecipe(id) {
    return defaultRecipes[id] || userRecipes[id] || null;
}

function getAllRecipes() {
    return { ...defaultRecipes, ...userRecipes };
}

function getRecipesByCategory(category) {
    const all = getAllRecipes();
    return Object.values(all).filter(r => r.category === category);
}

function filterByDietary(filters) {
    const all = getAllRecipes();
    return Object.values(all).filter(recipe => {
        if (filters.vegetarian && !recipe.dietary.vegetarian) return false;
        if (filters.vegan && !recipe.dietary.vegan) return false;
        if (filters.nutFree && recipe.dietary.nuts) return false;
        if (filters.dairyFree && recipe.dietary.dairy) return false;
        if (filters.glutenFree && recipe.dietary.gluten) return false;
        return true;
    });
}

function getNextUserRecipeID() {
    const ids = Object.keys(userRecipes).map(id => parseInt(id.slice(1)));
    const maxID = ids.length > 0 ? Math.max(...ids) : 49;
    return `R${maxID + 1}`;
}

function addCustomRecipe(recipe) {
    const id = getNextUserRecipeID();
    recipe.id = id;
    userRecipes[id] = recipe;
    saveUserRecipes();
    console.log(`Added custom recipe: ${id} - ${recipe.name}`);
    return id;
}

function updateRecipe(id, recipe) {
    if (userRecipes[id]) {
        userRecipes[id] = { ...recipe, id };
        saveUserRecipes();
        console.log(`Updated custom recipe: ${id}`);
        return true;
    }
    return false;
}

function deleteRecipe(id) {
    if (userRecipes[id]) {
        delete userRecipes[id];
        saveUserRecipes();
        console.log(`Deleted custom recipe: ${id}`);
        return true;
    }
    return false;
}

// Initialize on load
loadUserRecipes();

console.log('✅ Recipe Database loaded!');
console.log(`- ${Object.keys(defaultRecipes).length} default recipes`);
console.log(`- ${Object.keys(userRecipes).length} custom recipes`);
