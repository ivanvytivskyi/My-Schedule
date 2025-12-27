// ================================================
// RECIPE DATABASE - V2.1.0 EXPANDED (50+ RECIPES)
// ================================================
// All recipes use canonical product keys from product-catalog.js

const RECIPE_DATABASE = {
    // ========================================
    // BREAKFAST RECIPES (RB1-RB12) - 12 recipes
    // ========================================
    
    RB1: {
        id: "RB1",
        name: "Buckwheat Kasha with Milk",
        category: "breakfast",
        serves: 2,
        prepTime: "5 mins",
        cookTime: "20 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "buckwheat", qty: 200, unit: "g", display: "200g Buckwheat groats" },
            { canonicalKey: "milk", qty: 160, unit: "ml", display: "160ml Milk" },
            { canonicalKey: "butter", qty: 25, unit: "g", display: "25g Butter" },
            { canonicalKey: "water", qty: 160, unit: "ml", display: "160ml Water" },
            { canonicalKey: "salt", qty: 2, unit: "g", display: "Pinch of salt" },
            { canonicalKey: "sugar_white", qty: 10, unit: "g", display: "10g Sugar (optional)" }
        ],
        
        display: {
            emoji: "🥣",
            description: "Classic Ukrainian breakfast porridge - nutty buckwheat cooked until tender, served with warm milk.",
            time: "25 mins",
            servings: "2",
            instructions: [
                "Rinse buckwheat under cold water until clear",
                "Boil 160ml water with salt",
                "Add buckwheat, reduce to low, cover",
                "Simmer 12-15 mins until absorbed",
                "Rest covered 5 mins",
                "Warm milk separately",
                "Fluff buckwheat, add butter",
                "Pour milk over, add sugar, serve"
            ],
            tips: [
                "Don't skip the 5-minute rest",
                "Butter is essential for flavor",
                "Replace sugar with honey"
            ],
            video: "",
            nutrition: "Per serving: 340 cal, 12g protein, 8g fat, 52g carbs"
        }
    },
    
    RB2: {
        id: "RB2",
        name: "Scrambled Eggs on Toast",
        category: "breakfast",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "5 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "egg", qty: 2, unit: "count", display: "2 Large eggs" },
            { canonicalKey: "bread_white", qty: 2, unit: "slices", display: "2 Slices white bread" },
            { canonicalKey: "butter", qty: 15, unit: "g", display: "15g Butter" },
            { canonicalKey: "milk", qty: 30, unit: "ml", display: "30ml Milk (splash)" },
            { canonicalKey: "salt", qty: 1, unit: "g", display: "Salt to taste" }
        ],
        
        display: {
            emoji: "🍳",
            description: "Classic British breakfast - creamy scrambled eggs on buttered toast",
            time: "8 mins",
            servings: "1",
            instructions: [
                "Crack eggs into bowl, add milk and salt",
                "Whisk until combined",
                "Toast bread until golden",
                "Melt butter in non-stick pan (medium-low)",
                "Pour in egg mixture",
                "Stir gently, folding as they set",
                "Remove when still slightly wet",
                "Butter toast, top with eggs"
            ],
            tips: [
                "Low heat prevents rubbery eggs",
                "Remove early - they cook after",
                "Add cheese for extra flavor"
            ],
            video: "",
            nutrition: "Per serving: 420 cal, 18g protein, 22g fat, 35g carbs"
        }
    },
    
    RB3: {
        id: "RB3",
        name: "Porridge with Honey",
        category: "breakfast",
        serves: 1,
        prepTime: "2 mins",
        cookTime: "5 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "oats", qty: 50, unit: "g", display: "50g Oats" },
            { canonicalKey: "milk", qty: 200, unit: "ml", display: "200ml Milk" },
            { canonicalKey: "honey", qty: 15, unit: "g", display: "1 tbsp Honey" },
            { canonicalKey: "salt", qty: 1, unit: "g", display: "Pinch of salt" }
        ],
        
        display: {
            emoji: "🍯",
            description: "Creamy porridge sweetened with honey - warm and comforting",
            time: "7 mins",
            servings: "1",
            instructions: [
                "Add oats, milk, and salt to pan",
                "Bring to boil stirring",
                "Reduce heat, simmer 4-5 mins",
                "Stir frequently until creamy",
                "Pour into bowl",
                "Drizzle honey on top",
                "Serve hot"
            ],
            tips: [
                "Use jumbo oats for more texture",
                "Add banana or berries",
                "Make with water for vegan version"
            ],
            video: "",
            nutrition: "Per serving: 330 cal, 12g protein, 7g fat, 54g carbs"
        }
    },
    
    RB4: {
        id: "RB4",
        name: "Banana Pancakes",
        category: "breakfast",
        serves: 2,
        prepTime: "5 mins",
        cookTime: "10 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "banana", qty: 200, unit: "g", display: "2 Ripe bananas" },
            { canonicalKey: "egg", qty: 2, unit: "count", display: "2 Eggs" },
            { canonicalKey: "flour_plain", qty: 100, unit: "g", display: "100g Plain flour" },
            { canonicalKey: "milk", qty: 100, unit: "ml", display: "100ml Milk" },
            { canonicalKey: "butter", qty: 20, unit: "g", display: "20g Butter for frying" },
            { canonicalKey: "sugar_white", qty: 20, unit: "g", display: "20g Sugar" }
        ],
        
        display: {
            emoji: "🥞",
            description: "Fluffy pancakes with mashed banana - naturally sweet and delicious",
            time: "15 mins",
            servings: "2 (6 pancakes)",
            instructions: [
                "Mash bananas in bowl",
                "Whisk in eggs, milk, sugar",
                "Add flour, mix until smooth",
                "Heat butter in pan (medium)",
                "Pour batter to make 10cm pancakes",
                "Cook 2 mins until bubbles form",
                "Flip, cook 1-2 mins more",
                "Serve with honey or syrup"
            ],
            tips: [
                "Use very ripe bananas",
                "Don't overmix batter",
                "Keep warm in oven while cooking rest"
            ],
            video: "",
            nutrition: "Per serving: 450 cal, 14g protein, 14g fat, 68g carbs"
        }
    },
    
    RB5: {
        id: "RB5",
        name: "Avocado Toast",
        category: "breakfast",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "2 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "avocado", qty: 150, unit: "g", display: "1 Ripe avocado" },
            { canonicalKey: "bread_white", qty: 2, unit: "slices", display: "2 Slices bread" },
            { canonicalKey: "lemon_juice", qty: 10, unit: "ml", display: "Squeeze of lemon" },
            { canonicalKey: "salt", qty: 2, unit: "g", display: "Salt & pepper" },
            { canonicalKey: "olive_oil", qty: 5, unit: "ml", display: "Drizzle olive oil" }
        ],
        
        display: {
            emoji: "🥑",
            description: "Trendy and nutritious - creamy avocado on crispy toast",
            time: "7 mins",
            servings: "1",
            instructions: [
                "Toast bread until golden",
                "Halve avocado, remove pit",
                "Scoop flesh into bowl",
                "Mash with fork",
                "Add lemon juice, salt, pepper",
                "Spread on toast",
                "Drizzle olive oil on top"
            ],
            tips: [
                "Add poached egg for protein",
                "Sprinkle chili flakes for kick",
                "Choose ripe but firm avocado"
            ],
            video: "",
            nutrition: "Per serving: 420 cal, 8g protein, 28g fat, 38g carbs"
        }
    },
    
    RB6: {
        id: "RB6",
        name: "Greek Yogurt with Honey & Berries",
        category: "breakfast",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "yogurt_greek", qty: 200, unit: "g", display: "200g Greek yogurt" },
            { canonicalKey: "honey", qty: 20, unit: "g", display: "20g Honey" },
            { canonicalKey: "strawberries", qty: 80, unit: "g", display: "80g Strawberries" },
            { canonicalKey: "blueberries", qty: 50, unit: "g", display: "50g Blueberries" }
        ],
        
        display: {
            emoji: "🍓",
            description: "Quick, healthy breakfast - protein-packed yogurt with fresh berries",
            time: "3 mins",
            servings: "1",
            instructions: [
                "Spoon yogurt into bowl",
                "Wash and slice strawberries",
                "Top yogurt with berries",
                "Drizzle honey over",
                "Serve immediately"
            ],
            tips: [
                "Use any seasonal berries",
                "Add granola for crunch",
                "Swap honey for maple syrup"
            ],
            video: "",
            nutrition: "Per serving: 280 cal, 15g protein, 5g fat, 45g carbs"
        }
    },
    
    RB7: {
        id: "RB7",
        name: "Cheese Omelette",
        category: "breakfast",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "5 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "egg", qty: 3, unit: "count", display: "3 Eggs" },
            { canonicalKey: "cheddar_cheese", qty: 50, unit: "g", display: "50g Cheddar cheese" },
            { canonicalKey: "butter", qty: 15, unit: "g", display: "15g Butter" },
            { canonicalKey: "milk", qty: 30, unit: "ml", display: "30ml Milk" },
            { canonicalKey: "salt", qty: 1, unit: "g", display: "Salt & pepper" }
        ],
        
        display: {
            emoji: "🧀",
            description: "Classic French omelette with melted cheese - simple perfection",
            time: "8 mins",
            servings: "1",
            instructions: [
                "Whisk eggs with milk, salt, pepper",
                "Grate cheese",
                "Heat butter in pan (medium-high)",
                "Pour in eggs, swirl pan",
                "When edges set, add cheese to half",
                "Fold omelette in half",
                "Cook 1 min more",
                "Slide onto plate"
            ],
            tips: [
                "Don't overcook - should be slightly soft",
                "Add mushrooms or tomatoes",
                "Use non-stick pan"
            ],
            video: "",
            nutrition: "Per serving: 480 cal, 32g protein, 38g fat, 4g carbs"
        }
    },
    
    RB8: {
        id: "RB8",
        name: "Peanut Butter Toast with Banana",
        category: "breakfast",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "2 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: true,
            dairy: false,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "bread_white", qty: 2, unit: "slices", display: "2 Slices bread" },
            { canonicalKey: "peanut_butter", qty: 40, unit: "g", display: "2 tbsp Peanut butter" },
            { canonicalKey: "banana", qty: 120, unit: "g", display: "1 Banana" },
            { canonicalKey: "honey", qty: 10, unit: "g", display: "Drizzle of honey (optional)" }
        ],
        
        display: {
            emoji: "🥜",
            description: "Energy-packed breakfast - peanut butter and banana on toast",
            time: "5 mins",
            servings: "1",
            instructions: [
                "Toast bread until golden",
                "Spread peanut butter on toast",
                "Slice banana",
                "Arrange banana slices on top",
                "Drizzle honey if desired",
                "Serve immediately"
            ],
            tips: [
                "Use crunchy PB for texture",
                "Add cinnamon sprinkle",
                "Works great with almond butter too"
            ],
            video: "",
            nutrition: "Per serving: 480 cal, 16g protein, 18g fat, 65g carbs"
        }
    },
    
    RB9: {
        id: "RB9",
        name: "Boiled Eggs with Soldiers",
        category: "breakfast",
        serves: 1,
        prepTime: "2 mins",
        cookTime: "6 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "egg", qty: 2, unit: "count", display: "2 Eggs" },
            { canonicalKey: "bread_white", qty: 2, unit: "slices", display: "2 Slices bread" },
            { canonicalKey: "butter", qty: 15, unit: "g", display: "15g Butter" },
            { canonicalKey: "salt", qty: 2, unit: "g", display: "Salt to taste" }
        ],
        
        display: {
            emoji: "🥚",
            description: "Classic British breakfast - soft boiled eggs with buttered toast strips",
            time: "8 mins",
            servings: "1",
            instructions: [
                "Boil water in small pan",
                "Gently lower eggs in",
                "Boil 6 mins for runny yolk",
                "Toast bread while eggs cook",
                "Butter toast, cut into strips (soldiers)",
                "Remove eggs, place in egg cups",
                "Tap top off eggs",
                "Dip soldiers into yolk"
            ],
            tips: [
                "6 mins = runny, 7 mins = jammy",
                "Use room temp eggs",
                "Ice bath stops cooking"
            ],
            video: "",
            nutrition: "Per serving: 420 cal, 18g protein, 24g fat, 32g carbs"
        }
    },
    
    RB10: {
        id: "RB10",
        name: "Smoothie Bowl",
        category: "breakfast",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "banana", qty: 150, unit: "g", display: "1 Frozen banana" },
            { canonicalKey: "strawberries", qty: 100, unit: "g", display: "100g Strawberries" },
            { canonicalKey: "yogurt_greek", qty: 100, unit: "g", display: "100g Greek yogurt" },
            { canonicalKey: "milk", qty: 50, unit: "ml", display: "50ml Milk" },
            { canonicalKey: "honey", qty: 15, unit: "g", display: "15g Honey" }
        ],
        
        display: {
            emoji: "🥤",
            description: "Thick smoothie bowl topped with fresh fruit - Instagram-worthy breakfast",
            time: "5 mins",
            servings: "1",
            instructions: [
                "Blend frozen banana, strawberries, yogurt, milk",
                "Blend until thick and creamy",
                "Pour into bowl",
                "Top with fresh berries, granola",
                "Drizzle honey over",
                "Serve immediately with spoon"
            ],
            tips: [
                "Freeze banana night before",
                "Add spinach for greens",
                "Top with seeds for crunch"
            ],
            video: "",
            nutrition: "Per serving: 320 cal, 12g protein, 4g fat, 62g carbs"
        }
    },
    
    RB11: {
        id: "RB11",
        name: "Beans on Toast",
        category: "breakfast",
        serves: 1,
        prepTime: "2 mins",
        cookTime: "5 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "baked_beans", qty: 200, unit: "g", display: "200g Baked beans" },
            { canonicalKey: "bread_white", qty: 2, unit: "slices", display: "2 Slices bread" },
            { canonicalKey: "butter", qty: 10, unit: "g", display: "10g Butter (optional)" }
        ],
        
        display: {
            emoji: "🫘",
            description: "British classic - warm baked beans on crispy toast",
            time: "7 mins",
            servings: "1",
            instructions: [
                "Heat beans in small pan or microwave",
                "Toast bread until golden",
                "Butter toast if desired",
                "Pour hot beans over toast",
                "Serve immediately"
            ],
            tips: [
                "Add grated cheese on top",
                "Sprinkle black pepper",
                "Use sourdough for upgrade"
            ],
            video: "",
            nutrition: "Per serving: 380 cal, 14g protein, 6g fat, 68g carbs"
        }
    },
    
    RB12: {
        id: "RB12",
        name: "Fried Egg Sandwich",
        category: "breakfast",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "5 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "egg", qty: 2, unit: "count", display: "2 Eggs" },
            { canonicalKey: "bread_white", qty: 2, unit: "slices", display: "2 Slices bread" },
            { canonicalKey: "vegetable_oil", qty: 10, unit: "ml", display: "1 tbsp Oil" },
            { canonicalKey: "salt", qty: 1, unit: "g", display: "Salt & pepper" }
        ],
        
        display: {
            emoji: "🍞",
            description: "Simple and satisfying - fried eggs between toasted bread",
            time: "8 mins",
            servings: "1",
            instructions: [
                "Toast bread",
                "Heat oil in pan (medium)",
                "Crack eggs into pan",
                "Fry until whites set",
                "Season with salt, pepper",
                "Place eggs on one toast",
                "Top with second toast",
                "Cut in half, serve"
            ],
            tips: [
                "Cover pan for set tops",
                "Add ketchup or hot sauce",
                "Use butter instead of oil"
            ],
            video: "",
            nutrition: "Per serving: 400 cal, 16g protein, 20g fat, 38g carbs"
        }
    },
    
    // ========================================
    // BATCH COOK RECIPES (RBC1-RBC10) - 10 recipes
    // ========================================
    
    RBC1: {
        id: "RBC1",
        name: "Chicken Curry (Serves 4)",
        category: "batch",
        serves: 4,
        prepTime: "15 mins",
        cookTime: "35 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "chicken_breast", qty: 600, unit: "g", display: "600g Chicken breast" },
            { canonicalKey: "onion", qty: 200, unit: "g", display: "2 Onions" },
            { canonicalKey: "tomato", qty: 400, unit: "g", display: "400g Tomatoes" },
            { canonicalKey: "garlic", qty: 15, unit: "g", display: "3 Cloves garlic" },
            { canonicalKey: "ginger", qty: 10, unit: "g", display: "10g Ginger" },
            { canonicalKey: "curry_powder", qty: 20, unit: "g", display: "2 tbsp Curry powder" },
            { canonicalKey: "coconut_milk", qty: 400, unit: "ml", display: "400ml Coconut milk" },
            { canonicalKey: "vegetable_oil", qty: 30, unit: "ml", display: "2 tbsp Oil" },
            { canonicalKey: "salt", qty: 5, unit: "g", display: "Salt to taste" }
        ],
        
        display: {
            emoji: "🍛",
            description: "Creamy chicken curry - perfect for meal prep, freezes well",
            time: "50 mins",
            servings: "4",
            instructions: [
                "Dice chicken into chunks",
                "Chop onions, garlic, ginger",
                "Heat oil in large pot",
                "Fry onions until soft (5 mins)",
                "Add garlic, ginger, curry powder",
                "Cook 2 mins until fragrant",
                "Add chicken, brown all sides",
                "Add chopped tomatoes",
                "Pour in coconut milk",
                "Simmer 25 mins until chicken cooked",
                "Season with salt",
                "Serve with rice"
            ],
            tips: [
                "Freezes up to 3 months",
                "Add vegetables for more nutrition",
                "Adjust curry powder to taste"
            ],
            video: "",
            nutrition: "Per serving: 420 cal, 38g protein, 24g fat, 12g carbs"
        }
    },
    
    RBC2: {
        id: "RBC2",
        name: "Bolognese Sauce (Serves 6)",
        category: "batch",
        serves: 6,
        prepTime: "15 mins",
        cookTime: "45 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "beef_mince", qty: 800, unit: "g", display: "800g Beef mince" },
            { canonicalKey: "onion", qty: 200, unit: "g", display: "2 Onions" },
            { canonicalKey: "carrot", qty: 150, unit: "g", display: "2 Carrots" },
            { canonicalKey: "tomato_passata", qty: 800, unit: "ml", display: "800ml Passata" },
            { canonicalKey: "tomato_paste", qty: 50, unit: "g", display: "2 tbsp Tomato paste" },
            { canonicalKey: "garlic", qty: 15, unit: "g", display: "3 Cloves garlic" },
            { canonicalKey: "olive_oil", qty: 30, unit: "ml", display: "2 tbsp Olive oil" },
            { canonicalKey: "stock_cube", qty: 1, unit: "count", display: "1 Stock cube" },
            { canonicalKey: "salt", qty: 5, unit: "g", display: "Salt & pepper" }
        ],
        
        display: {
            emoji: "🍝",
            description: "Classic Italian meat sauce - makes 6 portions, perfect for freezing",
            time: "60 mins",
            servings: "6",
            instructions: [
                "Finely chop onions, carrots, garlic",
                "Heat oil in large pot",
                "Fry vegetables 10 mins until soft",
                "Add beef mince, break up with spoon",
                "Brown meat thoroughly",
                "Add tomato paste, cook 2 mins",
                "Pour in passata",
                "Crumble in stock cube",
                "Season with salt, pepper",
                "Simmer 45 mins, stirring occasionally",
                "Serve with pasta or freeze portions"
            ],
            tips: [
                "Freezes perfectly for 3 months",
                "Add red wine for depth",
                "Simmer longer for richer flavor"
            ],
            video: "",
            nutrition: "Per serving: 320 cal, 28g protein, 18g fat, 12g carbs"
        }
    },
    
    RBC3: {
        id: "RBC3",
        name: "Vegetable Chili (Serves 6)",
        category: "batch",
        serves: 6,
        prepTime: "15 mins",
        cookTime: "40 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "kidney_beans", qty: 800, unit: "g", display: "800g Kidney beans (2 cans)" },
            { canonicalKey: "chopped_tomatoes", qty: 800, unit: "g", display: "800g Chopped tomatoes (2 cans)" },
            { canonicalKey: "onion", qty: 200, unit: "g", display: "2 Onions" },
            { canonicalKey: "pepper_bell", qty: 300, unit: "g", display: "2 Bell peppers" },
            { canonicalKey: "carrot", qty: 200, unit: "g", display: "2 Carrots" },
            { canonicalKey: "garlic", qty: 15, unit: "g", display: "3 Cloves garlic" },
            { canonicalKey: "chili_powder", qty: 15, unit: "g", display: "1 tbsp Chili powder" },
            { canonicalKey: "cumin", qty: 10, unit: "g", display: "1 tsp Cumin" },
            { canonicalKey: "vegetable_oil", qty: 30, unit: "ml", display: "2 tbsp Oil" },
            { canonicalKey: "salt", qty: 5, unit: "g", display: "Salt to taste" }
        ],
        
        display: {
            emoji: "🌶️",
            description: "Hearty vegetable chili - warming, filling, and meat-free",
            time: "55 mins",
            servings: "6",
            instructions: [
                "Chop all vegetables",
                "Heat oil in large pot",
                "Fry onions 5 mins",
                "Add peppers, carrots, cook 5 mins",
                "Add garlic, spices, cook 1 min",
                "Add tomatoes, beans (drained)",
                "Bring to boil",
                "Reduce heat, simmer 30 mins",
                "Season with salt",
                "Serve with rice or freeze"
            ],
            tips: [
                "Great for meal prep",
                "Top with sour cream",
                "Adjust spice level to taste"
            ],
            video: "",
            nutrition: "Per serving: 240 cal, 12g protein, 5g fat, 38g carbs"
        }
    },
    
    RBC4: {
        id: "RBC4",
        name: "Lasagna (Serves 8)",
        category: "batch",
        serves: 8,
        prepTime: "30 mins",
        cookTime: "50 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "beef_mince", qty: 600, unit: "g", display: "600g Beef mince" },
            { canonicalKey: "lasagna_sheets", qty: 300, unit: "g", display: "300g Lasagna sheets" },
            { canonicalKey: "tomato_passata", qty: 700, unit: "ml", display: "700ml Passata" },
            { canonicalKey: "onion", qty: 150, unit: "g", display: "1 Onion" },
            { canonicalKey: "garlic", qty: 10, unit: "g", display: "2 Cloves garlic" },
            { canonicalKey: "cheese_mozzarella", qty: 250, unit: "g", display: "250g Mozzarella" },
            { canonicalKey: "cheese_parmesan", qty: 50, unit: "g", display: "50g Parmesan" },
            { canonicalKey: "milk", qty: 500, unit: "ml", display: "500ml Milk (for sauce)" },
            { canonicalKey: "flour_plain", qty: 50, unit: "g", display: "50g Flour" },
            { canonicalKey: "butter", qty: 50, unit: "g", display: "50g Butter" }
        ],
        
        display: {
            emoji: "🥘",
            description: "Classic Italian lasagna - layers of meat, pasta, and cheese",
            time: "80 mins",
            servings: "8",
            instructions: [
                "Make meat sauce: fry onion, garlic, add mince",
                "Add passata, simmer 20 mins",
                "Make white sauce: melt butter, add flour",
                "Gradually whisk in milk until thick",
                "Layer in dish: sauce, pasta, repeat",
                "Top with mozzarella, parmesan",
                "Bake 180°C for 40 mins",
                "Let rest 10 mins before serving"
            ],
            tips: [
                "Freezes beautifully",
                "Make ahead and reheat",
                "Use no-boil pasta sheets"
            ],
            video: "",
            nutrition: "Per serving: 480 cal, 28g protein, 22g fat, 42g carbs"
        }
    },
    
    RBC5: {
        id: "RBC5",
        name: "Chicken Stew (Serves 6)",
        category: "batch",
        serves: 6,
        prepTime: "20 mins",
        cookTime: "50 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "chicken_thigh", qty: 800, unit: "g", display: "800g Chicken thighs" },
            { canonicalKey: "potato", qty: 600, unit: "g", display: "4 Potatoes" },
            { canonicalKey: "carrot", qty: 300, unit: "g", display: "3 Carrots" },
            { canonicalKey: "onion", qty: 200, unit: "g", display: "2 Onions" },
            { canonicalKey: "stock_cube", qty: 2, unit: "count", display: "2 Chicken stock cubes" },
            { canonicalKey: "garlic", qty: 10, unit: "g", display: "2 Cloves garlic" },
            { canonicalKey: "vegetable_oil", qty: 30, unit: "ml", display: "2 tbsp Oil" },
            { canonicalKey: "salt", qty: 5, unit: "g", display: "Salt & pepper" }
        ],
        
        display: {
            emoji: "🍲",
            description: "Comforting chicken stew - one-pot wonder for cold days",
            time: "70 mins",
            servings: "6",
            instructions: [
                "Cut chicken into chunks",
                "Chop all vegetables",
                "Brown chicken in oil, remove",
                "Fry onions, carrots 5 mins",
                "Add garlic, cook 1 min",
                "Return chicken to pot",
                "Add potatoes",
                "Pour 1L hot stock",
                "Simmer 45 mins until tender",
                "Season and serve"
            ],
            tips: [
                "Add peas in last 5 mins",
                "Thicken with cornstarch if needed",
                "Freezes well for 3 months"
            ],
            video: "",
            nutrition: "Per serving: 380 cal, 32g protein, 14g fat, 32g carbs"
        }
    },
    
    RBC6: {
        id: "RBC6",
        name: "Beef Chili (Serves 6)",
        category: "batch",
        serves: 6,
        prepTime: "15 mins",
        cookTime: "60 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "beef_mince", qty: 800, unit: "g", display: "800g Beef mince" },
            { canonicalKey: "kidney_beans", qty: 800, unit: "g", display: "800g Kidney beans" },
            { canonicalKey: "chopped_tomatoes", qty: 800, unit: "g", display: "800g Chopped tomatoes" },
            { canonicalKey: "onion", qty: 200, unit: "g", display: "2 Onions" },
            { canonicalKey: "garlic", qty: 15, unit: "g", display: "3 Cloves garlic" },
            { canonicalKey: "chili_powder", qty: 20, unit: "g", display: "2 tbsp Chili powder" },
            { canonicalKey: "cumin", qty: 10, unit: "g", display: "1 tbsp Cumin" },
            { canonicalKey: "vegetable_oil", qty: 30, unit: "ml", display: "2 tbsp Oil" }
        ],
        
        display: {
            emoji: "🌶️",
            description: "Spicy beef chili - classic comfort food, great for crowds",
            time: "75 mins",
            servings: "6",
            instructions: [
                "Fry onions in oil until soft",
                "Add garlic, spices, cook 1 min",
                "Add beef mince, brown well",
                "Add tomatoes, beans (drained)",
                "Simmer 60 mins, stirring occasionally",
                "Season with salt",
                "Serve with rice or chips"
            ],
            tips: [
                "Tastes better next day",
                "Add dark chocolate for richness",
                "Freeze individual portions"
            ],
            video: "",
            nutrition: "Per serving: 420 cal, 36g protein, 18g fat, 28g carbs"
        }
    },
    
    RBC7: {
        id: "RBC7",
        name: "Pasta Bake (Serves 6)",
        category: "batch",
        serves: 6,
        prepTime: "20 mins",
        cookTime: "35 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "pasta_penne", qty: 500, unit: "g", display: "500g Penne pasta" },
            { canonicalKey: "tomato_passata", qty: 700, unit: "ml", display: "700ml Passata" },
            { canonicalKey: "cheese_mozzarella", qty: 200, unit: "g", display: "200g Mozzarella" },
            { canonicalKey: "cheese_cheddar", qty: 100, unit: "g", display: "100g Cheddar" },
            { canonicalKey: "onion", qty: 150, unit: "g", display: "1 Onion" },
            { canonicalKey: "garlic", qty: 10, unit: "g", display: "2 Cloves garlic" },
            { canonicalKey: "olive_oil", qty: 30, unit: "ml", display: "2 tbsp Olive oil" }
        ],
        
        display: {
            emoji: "🍝",
            description: "Cheesy pasta bake - crowd-pleaser that reheats beautifully",
            time: "55 mins",
            servings: "6",
            instructions: [
                "Cook pasta until al dente, drain",
                "Fry onions, garlic in oil",
                "Add passata, simmer 10 mins",
                "Mix sauce with cooked pasta",
                "Pour into baking dish",
                "Top with grated cheeses",
                "Bake 180°C for 25 mins until golden",
                "Let rest 5 mins before serving"
            ],
            tips: [
                "Add vegetables for nutrition",
                "Use any pasta shape",
                "Freezes well before baking"
            ],
            video: "",
            nutrition: "Per serving: 420 cal, 18g protein, 14g fat, 58g carbs"
        }
    },
    
    RBC8: {
        id: "RBC8",
        name: "Shepherd's Pie (Serves 6)",
        category: "batch",
        serves: 6,
        prepTime: "25 mins",
        cookTime: "45 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "lamb_mince", qty: 800, unit: "g", display: "800g Lamb mince" },
            { canonicalKey: "potato", qty: 1000, unit: "g", display: "1kg Potatoes" },
            { canonicalKey: "carrot", qty: 200, unit: "g", display: "2 Carrots" },
            { canonicalKey: "onion", qty: 150, unit: "g", display: "1 Onion" },
            { canonicalKey: "peas_frozen", qty: 150, unit: "g", display: "150g Frozen peas" },
            { canonicalKey: "stock_cube", qty: 1, unit: "count", display: "1 Stock cube" },
            { canonicalKey: "butter", qty: 50, unit: "g", display: "50g Butter" },
            { canonicalKey: "milk", qty: 100, unit: "ml", display: "100ml Milk" }
        ],
        
        display: {
            emoji: "🥧",
            description: "British classic - lamb mince topped with creamy mashed potato",
            time: "70 mins",
            servings: "6",
            instructions: [
                "Boil potatoes until tender",
                "Brown lamb mince, drain fat",
                "Add chopped onions, carrots",
                "Cook 5 mins",
                "Add 300ml stock, peas",
                "Simmer 20 mins",
                "Mash potatoes with butter, milk",
                "Spread mince in dish, top with mash",
                "Bake 180°C for 25 mins until golden"
            ],
            tips: [
                "Use beef for Cottage Pie",
                "Fork patterns on top look nice",
                "Freezes beautifully"
            ],
            video: "",
            nutrition: "Per serving: 480 cal, 32g protein, 24g fat, 36g carbs"
        }
    },
    
    RBC9: {
        id: "RBC9",
        name: "Pulled Pork (Serves 8)",
        category: "batch",
        serves: 8,
        prepTime: "15 mins",
        cookTime: "240 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "pork_shoulder", qty: 1500, unit: "g", display: "1.5kg Pork shoulder" },
            { canonicalKey: "bbq_sauce", qty: 300, unit: "ml", display: "300ml BBQ sauce" },
            { canonicalKey: "onion", qty: 200, unit: "g", display: "2 Onions" },
            { canonicalKey: "garlic", qty: 15, unit: "g", display: "3 Cloves garlic" },
            { canonicalKey: "paprika", qty: 10, unit: "g", display: "1 tbsp Paprika" },
            { canonicalKey: "brown_sugar", qty: 30, unit: "g", display: "2 tbsp Brown sugar" },
            { canonicalKey: "salt", qty: 10, unit: "g", display: "Salt & pepper" }
        ],
        
        display: {
            emoji: "🥩",
            description: "Slow-cooked pulled pork - tender, flavorful, perfect for sandwiches",
            time: "4 hours 15 mins",
            servings: "8",
            instructions: [
                "Rub pork with paprika, sugar, salt",
                "Slice onions, crush garlic",
                "Place onions in slow cooker",
                "Put pork on top",
                "Pour BBQ sauce over",
                "Cook on low 8 hours (or high 4 hours)",
                "Shred with forks",
                "Mix with sauce",
                "Serve in buns or freeze"
            ],
            tips: [
                "Use slow cooker for best results",
                "Freezes perfectly for 3 months",
                "Great for meal prep"
            ],
            video: "",
            nutrition: "Per serving: 380 cal, 42g protein, 16g fat, 14g carbs"
        }
    },
    
    RBC10: {
        id: "RBC10",
        name: "Vegetable Soup (Serves 6)",
        category: "batch",
        serves: 6,
        prepTime: "15 mins",
        cookTime: "35 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "potato", qty: 400, unit: "g", display: "3 Potatoes" },
            { canonicalKey: "carrot", qty: 300, unit: "g", display: "3 Carrots" },
            { canonicalKey: "onion", qty: 200, unit: "g", display: "2 Onions" },
            { canonicalKey: "celery", qty: 150, unit: "g", display: "2 Celery sticks" },
            { canonicalKey: "leek", qty: 200, unit: "g", display: "1 Leek" },
            { canonicalKey: "stock_cube", qty: 2, unit: "count", display: "2 Veg stock cubes" },
            { canonicalKey: "olive_oil", qty: 30, unit: "ml", display: "2 tbsp Olive oil" },
            { canonicalKey: "salt", qty: 5, unit: "g", display: "Salt & pepper" }
        ],
        
        display: {
            emoji: "🥣",
            description: "Healthy vegetable soup - warming, nutritious, and freezer-friendly",
            time: "50 mins",
            servings: "6",
            instructions: [
                "Chop all vegetables",
                "Heat oil in large pot",
                "Fry onions, leeks 5 mins",
                "Add carrots, celery, cook 5 mins",
                "Add potatoes",
                "Pour 1.5L hot stock",
                "Simmer 25 mins until tender",
                "Blend half if desired",
                "Season and serve"
            ],
            tips: [
                "Add any vegetables you have",
                "Freezes well for 3 months",
                "Serve with crusty bread"
            ],
            video: "",
            nutrition: "Per serving: 140 cal, 3g protein, 5g fat, 22g carbs"
        }
    },
    
    // ========================================
    // MEAL RECIPES (RM1-RM12) - 12 recipes
    // ========================================
    
    RM1: {
        id: "RM1",
        name: "Grilled Cheese Sandwich",
        category: "main",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "5 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "bread_white", qty: 2, unit: "slices", display: "2 Slices bread" },
            { canonicalKey: "cheese_cheddar", qty: 60, unit: "g", display: "60g Cheddar cheese" },
            { canonicalKey: "butter", qty: 20, unit: "g", display: "20g Butter" }
        ],
        
        display: {
            emoji: "🧀",
            description: "Classic comfort food - crispy golden bread with melted cheese",
            time: "8 mins",
            servings: "1",
            instructions: [
                "Butter one side of each bread slice",
                "Place cheese between bread (butter outside)",
                "Heat pan on medium",
                "Cook 2-3 mins per side until golden",
                "Press gently with spatula",
                "Serve hot"
            ],
            tips: [
                "Use mix of cheeses",
                "Add tomato for upgrade",
                "Don't use high heat"
            ],
            video: "",
            nutrition: "Per serving: 520 cal, 20g protein, 32g fat, 38g carbs"
        }
    },
    
    RM2: {
        id: "RM2",
        name: "Jacket Potato with Beans",
        category: "main",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "60 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "potato", qty: 300, unit: "g", display: "1 Large potato" },
            { canonicalKey: "baked_beans", qty: 200, unit: "g", display: "200g Baked beans" },
            { canonicalKey: "butter", qty: 15, unit: "g", display: "15g Butter (optional)" },
            { canonicalKey: "salt", qty: 2, unit: "g", display: "Salt to taste" }
        ],
        
        display: {
            emoji: "🥔",
            description: "Simple British classic - fluffy baked potato with hot beans",
            time: "65 mins",
            servings: "1",
            instructions: [
                "Preheat oven to 200°C",
                "Scrub potato, prick with fork",
                "Rub with oil and salt",
                "Bake 60 mins until crispy",
                "Heat beans while potato cooks",
                "Cut cross in top of potato",
                "Squeeze to fluff up",
                "Add butter, pour beans over"
            ],
            tips: [
                "Microwave 8 mins then oven 20 mins to save time",
                "Add grated cheese",
                "Sweet potato works too"
            ],
            video: "",
            nutrition: "Per serving: 420 cal, 14g protein, 6g fat, 78g carbs"
        }
    },
    
    RM3: {
        id: "RM3",
        name: "Tuna Pasta",
        category: "main",
        serves: 2,
        prepTime: "5 mins",
        cookTime: "12 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "pasta_penne", qty: 200, unit: "g", display: "200g Penne pasta" },
            { canonicalKey: "tuna_canned", qty: 200, unit: "g", display: "200g Canned tuna" },
            { canonicalKey: "tomato_passata", qty: 200, unit: "ml", display: "200ml Passata" },
            { canonicalKey: "onion", qty: 100, unit: "g", display: "1 Small onion" },
            { canonicalKey: "garlic", qty: 5, unit: "g", display: "1 Clove garlic" },
            { canonicalKey: "olive_oil", qty: 20, unit: "ml", display: "1 tbsp Olive oil" }
        ],
        
        display: {
            emoji: "🍝",
            description: "Quick and easy tuna pasta - ready in 15 minutes",
            time: "17 mins",
            servings: "2",
            instructions: [
                "Boil pasta according to package",
                "Fry onion in oil until soft",
                "Add garlic, cook 1 min",
                "Add passata, simmer 5 mins",
                "Drain tuna, add to sauce",
                "Drain pasta, mix with sauce",
                "Serve immediately"
            ],
            tips: [
                "Add chili flakes for kick",
                "Use sweetcorn for extra veg",
                "Top with parmesan"
            ],
            video: "",
            nutrition: "Per serving: 480 cal, 32g protein, 10g fat, 68g carbs"
        }
    },
    
    RM4: {
        id: "RM4",
        name: "Chicken Stir-Fry",
        category: "main",
        serves: 2,
        prepTime: "10 mins",
        cookTime: "10 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "chicken_breast", qty: 300, unit: "g", display: "300g Chicken breast" },
            { canonicalKey: "pepper_bell", qty: 200, unit: "g", display: "1 Bell pepper" },
            { canonicalKey: "broccoli", qty: 150, unit: "g", display: "150g Broccoli" },
            { canonicalKey: "soy_sauce", qty: 30, unit: "ml", display: "2 tbsp Soy sauce" },
            { canonicalKey: "vegetable_oil", qty: 20, unit: "ml", display: "1 tbsp Oil" },
            { canonicalKey: "garlic", qty: 5, unit: "g", display: "1 Clove garlic" },
            { canonicalKey: "ginger", qty: 5, unit: "g", display: "5g Ginger" }
        ],
        
        display: {
            emoji: "🥘",
            description: "Quick Asian-style stir-fry - healthy and colorful",
            time: "20 mins",
            servings: "2",
            instructions: [
                "Slice chicken into strips",
                "Chop all vegetables",
                "Heat oil in wok/large pan (high heat)",
                "Stir-fry chicken 5 mins",
                "Add vegetables, cook 3 mins",
                "Add garlic, ginger, cook 1 min",
                "Add soy sauce, toss",
                "Serve with rice"
            ],
            tips: [
                "Keep heat high throughout",
                "Don't overcrowd pan",
                "Use any vegetables you have"
            ],
            video: "",
            nutrition: "Per serving: 280 cal, 38g protein, 10g fat, 12g carbs"
        }
    },
    
    RM5: {
        id: "RM5",
        name: "Fish and Chips",
        category: "main",
        serves: 2,
        prepTime: "10 mins",
        cookTime: "35 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "cod_fillet", qty: 400, unit: "g", display: "400g Cod fillets" },
            { canonicalKey: "potato", qty: 600, unit: "g", display: "4 Potatoes" },
            { canonicalKey: "flour_plain", qty: 80, unit: "g", display: "80g Plain flour" },
            { canonicalKey: "vegetable_oil", qty: 100, unit: "ml", display: "Oil for frying" },
            { canonicalKey: "salt", qty: 5, unit: "g", display: "Salt to taste" }
        ],
        
        display: {
            emoji: "🐟",
            description: "British classic - crispy battered fish with homemade chips",
            time: "45 mins",
            servings: "2",
            instructions: [
                "Cut potatoes into chips",
                "Parboil chips 5 mins, drain",
                "Pat fish dry",
                "Coat fish in flour",
                "Heat oil in deep pan",
                "Fry chips until golden, remove",
                "Fry fish 4 mins per side",
                "Drain on paper, season",
                "Serve with peas"
            ],
            tips: [
                "Use frozen chips to save time",
                "Serve with malt vinegar",
                "Tartare sauce is traditional"
            ],
            video: "",
            nutrition: "Per serving: 620 cal, 42g protein, 24g fat, 62g carbs"
        }
    },
    
    RM6: {
        id: "RM6",
        name: "Sausage and Mash",
        category: "main",
        serves: 2,
        prepTime: "10 mins",
        cookTime: "25 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "sausage", qty: 400, unit: "g", display: "4 Sausages" },
            { canonicalKey: "potato", qty: 600, unit: "g", display: "4 Potatoes" },
            { canonicalKey: "butter", qty: 40, unit: "g", display: "40g Butter" },
            { canonicalKey: "milk", qty: 80, unit: "ml", display: "80ml Milk" },
            { canonicalKey: "onion", qty: 150, unit: "g", display: "1 Onion" },
            { canonicalKey: "gravy_granules", qty: 15, unit: "g", display: "1 tbsp Gravy granules" }
        ],
        
        display: {
            emoji: "🌭",
            description: "British comfort food - sausages with creamy mashed potato and gravy",
            time: "35 mins",
            servings: "2",
            instructions: [
                "Boil potatoes until tender",
                "Grill/fry sausages 15 mins",
                "Fry onions until caramelized",
                "Mash potatoes with butter, milk",
                "Make gravy with granules & water",
                "Serve sausages on mash",
                "Pour gravy over",
                "Top with onions"
            ],
            tips: [
                "Use good quality sausages",
                "Add mustard to mash",
                "Peas are traditional side"
            ],
            video: "",
            nutrition: "Per serving: 720 cal, 28g protein, 42g fat, 58g carbs"
        }
    },
    
    RM7: {
        id: "RM7",
        name: "Vegetable Omelette",
        category: "main",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "8 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "egg", qty: 3, unit: "count", display: "3 Eggs" },
            { canonicalKey: "tomato", qty: 100, unit: "g", display: "1 Tomato" },
            { canonicalKey: "mushroom", qty: 60, unit: "g", display: "3 Mushrooms" },
            { canonicalKey: "pepper_bell", qty: 80, unit: "g", display: "½ Bell pepper" },
            { canonicalKey: "butter", qty: 20, unit: "g", display: "20g Butter" },
            { canonicalKey: "salt", qty: 2, unit: "g", display: "Salt & pepper" }
        ],
        
        display: {
            emoji: "🍳",
            description: "Healthy vegetable-packed omelette - light but filling",
            time: "13 mins",
            servings: "1",
            instructions: [
                "Chop all vegetables",
                "Beat eggs with salt, pepper",
                "Heat butter in pan",
                "Sauté vegetables 3 mins",
                "Pour eggs over vegetables",
                "Cook until edges set",
                "Fold in half",
                "Serve immediately"
            ],
            tips: [
                "Don't overcook eggs",
                "Add cheese for extra flavor",
                "Use any vegetables you have"
            ],
            video: "",
            nutrition: "Per serving: 420 cal, 26g protein, 30g fat, 10g carbs"
        }
    },
    
    RM8: {
        id: "RM8",
        name: "Chicken Quesadilla",
        category: "main",
        serves: 2,
        prepTime: "10 mins",
        cookTime: "10 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "chicken_breast", qty: 200, unit: "g", display: "200g Chicken breast" },
            { canonicalKey: "tortilla_wraps", qty: 4, unit: "count", display: "4 Tortilla wraps" },
            { canonicalKey: "cheese_cheddar", qty: 120, unit: "g", display: "120g Cheddar cheese" },
            { canonicalKey: "pepper_bell", qty: 150, unit: "g", display: "1 Bell pepper" },
            { canonicalKey: "vegetable_oil", qty: 20, unit: "ml", display: "1 tbsp Oil" }
        ],
        
        display: {
            emoji: "🌮",
            description: "Mexican-style quesadilla - crispy tortilla with melted cheese",
            time: "20 mins",
            servings: "2",
            instructions: [
                "Cook chicken, slice into strips",
                "Slice pepper",
                "Grate cheese",
                "Layer cheese, chicken, pepper on tortilla",
                "Top with second tortilla",
                "Dry fry in pan 2 mins per side",
                "Cut into wedges",
                "Serve with salsa"
            ],
            tips: [
                "Press down while cooking",
                "Don't overfill",
                "Add jalapeños for heat"
            ],
            video: "",
            nutrition: "Per serving: 580 cal, 42g protein, 26g fat, 48g carbs"
        }
    },
    
    RM9: {
        id: "RM9",
        name: "Beef Burger",
        category: "main",
        serves: 2,
        prepTime: "10 mins",
        cookTime: "10 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "beef_mince", qty: 300, unit: "g", display: "300g Beef mince" },
            { canonicalKey: "burger_buns", qty: 2, unit: "count", display: "2 Burger buns" },
            { canonicalKey: "cheese_cheddar", qty: 60, unit: "g", display: "2 Cheese slices" },
            { canonicalKey: "lettuce", qty: 40, unit: "g", display: "Lettuce leaves" },
            { canonicalKey: "tomato", qty: 100, unit: "g", display: "1 Tomato" },
            { canonicalKey: "onion", qty: 50, unit: "g", display: "½ Onion" },
            { canonicalKey: "salt", qty: 3, unit: "g", display: "Salt & pepper" }
        ],
        
        display: {
            emoji: "🍔",
            description: "Homemade beef burger - better than takeaway!",
            time: "20 mins",
            servings: "2",
            instructions: [
                "Season mince with salt, pepper",
                "Form into 2 patties",
                "Heat pan (high)",
                "Cook burgers 4 mins per side",
                "Add cheese in last minute",
                "Toast buns",
                "Build: bun, lettuce, burger, tomato, onion, bun",
                "Serve with chips"
            ],
            tips: [
                "Don't press burgers while cooking",
                "Make patties slightly wider than bun",
                "Add bacon for cheeseburger"
            ],
            video: "",
            nutrition: "Per serving: 580 cal, 38g protein, 28g fat, 42g carbs"
        }
    },
    
    RM10: {
        id: "RM10",
        name: "Margherita Pizza",
        category: "main",
        serves: 2,
        prepTime: "15 mins",
        cookTime: "15 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "pizza_base", qty: 2, unit: "count", display: "2 Pizza bases" },
            { canonicalKey: "tomato_passata", qty: 150, unit: "ml", display: "150ml Passata" },
            { canonicalKey: "cheese_mozzarella", qty: 200, unit: "g", display: "200g Mozzarella" },
            { canonicalKey: "basil", qty: 10, unit: "g", display: "Fresh basil" },
            { canonicalKey: "olive_oil", qty: 20, unit: "ml", display: "1 tbsp Olive oil" }
        ],
        
        display: {
            emoji: "🍕",
            description: "Classic Italian pizza - simple ingredients, amazing flavor",
            time: "30 mins",
            servings: "2",
            instructions: [
                "Preheat oven to 220°C",
                "Spread passata on pizza bases",
                "Tear mozzarella, distribute evenly",
                "Drizzle olive oil",
                "Bake 12-15 mins until golden",
                "Top with fresh basil",
                "Slice and serve"
            ],
            tips: [
                "Hot oven is key",
                "Don't overload with toppings",
                "Use pizza stone if you have one"
            ],
            video: "",
            nutrition: "Per serving: 520 cal, 24g protein, 20g fat, 62g carbs"
        }
    },
    
    RM11: {
        id: "RM11",
        name: "Salmon with Vegetables",
        category: "main",
        serves: 2,
        prepTime: "10 mins",
        cookTime: "20 mins",
        
        dietary: {
            vegetarian: false,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "salmon_fillet", qty: 300, unit: "g", display: "300g Salmon fillets" },
            { canonicalKey: "broccoli", qty: 200, unit: "g", display: "200g Broccoli" },
            { canonicalKey: "carrot", qty: 150, unit: "g", display: "2 Carrots" },
            { canonicalKey: "lemon_juice", qty: 20, unit: "ml", display: "1 tbsp Lemon juice" },
            { canonicalKey: "olive_oil", qty: 20, unit: "ml", display: "1 tbsp Olive oil" },
            { canonicalKey: "salt", qty: 2, unit: "g", display: "Salt & pepper" }
        ],
        
        display: {
            emoji: "🐟",
            description: "Healthy baked salmon with roasted vegetables",
            time: "30 mins",
            servings: "2",
            instructions: [
                "Preheat oven to 180°C",
                "Place salmon on baking tray",
                "Drizzle with oil, lemon juice",
                "Season with salt, pepper",
                "Chop vegetables",
                "Toss vegetables in oil",
                "Bake together 18-20 mins",
                "Serve immediately"
            ],
            tips: [
                "Don't overcook salmon",
                "Add garlic for extra flavor",
                "Use any vegetables"
            ],
            video: "",
            nutrition: "Per serving: 380 cal, 32g protein, 22g fat, 14g carbs"
        }
    },
    
    RM12: {
        id: "RM12",
        name: "Vegetable Curry",
        category: "main",
        serves: 2,
        prepTime: "15 mins",
        cookTime: "25 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "potato", qty: 300, unit: "g", display: "2 Potatoes" },
            { canonicalKey: "cauliflower", qty: 200, unit: "g", display: "200g Cauliflower" },
            { canonicalKey: "peas_frozen", qty: 100, unit: "g", display: "100g Peas" },
            { canonicalKey: "onion", qty: 150, unit: "g", display: "1 Onion" },
            { canonicalKey: "tomato", qty: 200, unit: "g", display: "2 Tomatoes" },
            { canonicalKey: "curry_powder", qty: 15, unit: "g", display: "1 tbsp Curry powder" },
            { canonicalKey: "coconut_milk", qty: 200, unit: "ml", display: "200ml Coconut milk" },
            { canonicalKey: "vegetable_oil", qty: 20, unit: "ml", display: "1 tbsp Oil" }
        ],
        
        display: {
            emoji: "🍛",
            description: "Mild vegetable curry - creamy, comforting, vegan-friendly",
            time: "40 mins",
            servings: "2",
            instructions: [
                "Chop all vegetables",
                "Fry onions in oil",
                "Add curry powder, cook 1 min",
                "Add potatoes, cauliflower",
                "Add chopped tomatoes",
                "Pour in coconut milk",
                "Simmer 20 mins",
                "Add peas, cook 5 mins",
                "Serve with rice"
            ],
            tips: [
                "Adjust spice to taste",
                "Add chickpeas for protein",
                "Use any vegetables"
            ],
            video: "",
            nutrition: "Per serving: 380 cal, 8g protein, 18g fat, 48g carbs"
        }
    },
    
    // ========================================
    // DRINK RECIPES (RD1-RD6) - 6 recipes
    // ========================================
    
    RD1: {
        id: "RD1",
        name: "Fruit Smoothie",
        category: "drink",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "banana", qty: 120, unit: "g", display: "1 Banana" },
            { canonicalKey: "strawberries", qty: 100, unit: "g", display: "100g Strawberries" },
            { canonicalKey: "yogurt_natural", qty: 100, unit: "g", display: "100g Natural yogurt" },
            { canonicalKey: "milk", qty: 150, unit: "ml", display: "150ml Milk" },
            { canonicalKey: "honey", qty: 15, unit: "g", display: "1 tbsp Honey" }
        ],
        
        display: {
            emoji: "🥤",
            description: "Refreshing fruit smoothie - perfect breakfast on the go",
            time: "5 mins",
            servings: "1",
            instructions: [
                "Add all ingredients to blender",
                "Blend until smooth",
                "Taste and adjust sweetness",
                "Pour into glass",
                "Serve immediately"
            ],
            tips: [
                "Use frozen fruit for thicker smoothie",
                "Add spinach for greens",
                "Use any fruit combination"
            ],
            video: "",
            nutrition: "Per serving: 320 cal, 10g protein, 4g fat, 62g carbs"
        }
    },
    
    RD2: {
        id: "RD2",
        name: "Hot Chocolate",
        category: "drink",
        serves: 1,
        prepTime: "2 mins",
        cookTime: "5 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "milk", qty: 250, unit: "ml", display: "250ml Milk" },
            { canonicalKey: "cocoa_powder", qty: 20, unit: "g", display: "2 tbsp Cocoa powder" },
            { canonicalKey: "sugar_white", qty: 15, unit: "g", display: "1 tbsp Sugar" }
        ],
        
        display: {
            emoji: "☕",
            description: "Rich hot chocolate - perfect winter warmer",
            time: "7 mins",
            servings: "1",
            instructions: [
                "Mix cocoa and sugar in mug",
                "Add 2 tbsp milk, mix to paste",
                "Heat remaining milk",
                "Pour hot milk into mug",
                "Stir well",
                "Top with whipped cream if desired"
            ],
            tips: [
                "Use dark chocolate for richer taste",
                "Add marshmallows on top",
                "Use vanilla extract for flavor"
            ],
            video: "",
            nutrition: "Per serving: 220 cal, 10g protein, 6g fat, 32g carbs"
        }
    },
    
    RD3: {
        id: "RD3",
        name: "Iced Coffee",
        category: "drink",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "coffee_instant", qty: 5, unit: "g", display: "1 tsp Instant coffee" },
            { canonicalKey: "milk", qty: 200, unit: "ml", display: "200ml Cold milk" },
            { canonicalKey: "sugar_white", qty: 10, unit: "g", display: "1 tsp Sugar (optional)" },
            { canonicalKey: "ice", qty: 100, unit: "g", display: "Ice cubes" }
        ],
        
        display: {
            emoji: "🧊",
            description: "Refreshing iced coffee - perfect summer pick-me-up",
            time: "5 mins",
            servings: "1",
            instructions: [
                "Mix coffee and sugar with hot water",
                "Stir until dissolved",
                "Let cool 2 mins",
                "Fill glass with ice",
                "Pour coffee over ice",
                "Add cold milk",
                "Stir and serve"
            ],
            tips: [
                "Make coffee ice cubes",
                "Add vanilla syrup",
                "Use oat milk for vegan"
            ],
            video: "",
            nutrition: "Per serving: 120 cal, 6g protein, 4g fat, 16g carbs"
        }
    },
    
    RD4: {
        id: "RD4",
        name: "Lemonade",
        category: "drink",
        serves: 4,
        prepTime: "10 mins",
        cookTime: "5 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "lemon_juice", qty: 150, unit: "ml", display: "Juice of 5 lemons" },
            { canonicalKey: "sugar_white", qty: 150, unit: "g", display: "150g Sugar" },
            { canonicalKey: "water", qty: 1000, unit: "ml", display: "1L Water" },
            { canonicalKey: "ice", qty: 200, unit: "g", display: "Ice cubes" }
        ],
        
        display: {
            emoji: "🍋",
            description: "Fresh homemade lemonade - tangy and refreshing",
            time: "15 mins",
            servings: "4",
            instructions: [
                "Make sugar syrup: heat sugar with 250ml water",
                "Stir until sugar dissolved",
                "Let cool",
                "Mix lemon juice, syrup, remaining water",
                "Taste and adjust sweetness",
                "Chill in fridge",
                "Serve over ice"
            ],
            tips: [
                "Add mint leaves",
                "Use sparkling water",
                "Reduce sugar for healthier version"
            ],
            video: "",
            nutrition: "Per serving: 150 cal, 0g protein, 0g fat, 38g carbs"
        }
    },
    
    RD5: {
        id: "RD5",
        name: "Protein Shake",
        category: "drink",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: true,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "protein_powder", qty: 30, unit: "g", display: "30g Protein powder" },
            { canonicalKey: "milk", qty: 300, unit: "ml", display: "300ml Milk" },
            { canonicalKey: "banana", qty: 120, unit: "g", display: "1 Banana" },
            { canonicalKey: "peanut_butter", qty: 20, unit: "g", display: "1 tbsp Peanut butter" }
        ],
        
        display: {
            emoji: "💪",
            description: "Post-workout protein shake - helps muscle recovery",
            time: "3 mins",
            servings: "1",
            instructions: [
                "Add all ingredients to blender",
                "Blend until smooth",
                "Pour into shaker or glass",
                "Drink within 30 mins of workout"
            ],
            tips: [
                "Add oats for extra carbs",
                "Use ice for thicker shake",
                "Swap PB for almond butter"
            ],
            video: "",
            nutrition: "Per serving: 420 cal, 35g protein, 12g fat, 42g carbs"
        }
    },
    
    RD6: {
        id: "RD6",
        name: "Green Smoothie",
        category: "drink",
        serves: 1,
        prepTime: "5 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "spinach", qty: 60, unit: "g", display: "2 handfuls Spinach" },
            { canonicalKey: "banana", qty: 120, unit: "g", display: "1 Banana" },
            { canonicalKey: "apple", qty: 150, unit: "g", display: "1 Apple" },
            { canonicalKey: "yogurt_natural", qty: 100, unit: "g", display: "100g Natural yogurt" },
            { canonicalKey: "honey", qty: 15, unit: "g", display: "1 tbsp Honey" },
            { canonicalKey: "water", qty: 100, unit: "ml", display: "100ml Water" }
        ],
        
        display: {
            emoji: "🥬",
            description: "Healthy green smoothie - packed with vitamins",
            time: "5 mins",
            servings: "1",
            instructions: [
                "Wash spinach thoroughly",
                "Peel and chop apple, banana",
                "Add all ingredients to blender",
                "Blend until completely smooth",
                "Add more water if too thick",
                "Serve immediately"
            ],
            tips: [
                "You can't taste the spinach",
                "Add cucumber for extra freshness",
                "Use frozen banana"
            ],
            video: "",
            nutrition: "Per serving: 280 cal, 6g protein, 2g fat, 62g carbs"
        }
    },
    
    // ========================================
    // SNACK RECIPES (RS1-RS8) - 8 recipes
    // ========================================
    
    RS1: {
        id: "RS1",
        name: "Apple Slices with Peanut Butter",
        category: "snacks",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: true,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "apple", qty: 150, unit: "g", display: "1 Apple" },
            { canonicalKey: "peanut_butter", qty: 30, unit: "g", display: "2 tbsp Peanut butter" }
        ],
        
        display: {
            emoji: "🍎",
            description: "Quick healthy snack - sweet and satisfying",
            time: "3 mins",
            servings: "1",
            instructions: [
                "Wash and core apple",
                "Slice into wedges",
                "Arrange on plate",
                "Serve with peanut butter for dipping"
            ],
            tips: [
                "Use crunchy PB for texture",
                "Add honey drizzle",
                "Works with almond butter too"
            ],
            video: "",
            nutrition: "Per serving: 220 cal, 6g protein, 12g fat, 25g carbs"
        }
    },
    
    RS2: {
        id: "RS2",
        name: "Cheese and Crackers",
        category: "snacks",
        serves: 1,
        prepTime: "2 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "crackers", qty: 40, unit: "g", display: "8 Crackers" },
            { canonicalKey: "cheese_cheddar", qty: 50, unit: "g", display: "50g Cheddar cheese" }
        ],
        
        display: {
            emoji: "🧀",
            description: "Classic simple snack - cheese on crackers",
            time: "2 mins",
            servings: "1",
            instructions: [
                "Slice cheese",
                "Arrange crackers on plate",
                "Top each with cheese",
                "Serve immediately"
            ],
            tips: [
                "Add grapes on the side",
                "Try different cheese varieties",
                "Use whole wheat crackers"
            ],
            video: "",
            nutrition: "Per serving: 280 cal, 12g protein, 16g fat, 22g carbs"
        }
    },
    
    RS3: {
        id: "RS3",
        name: "Hummus with Vegetables",
        category: "snacks",
        serves: 2,
        prepTime: "5 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "hummus", qty: 150, unit: "g", display: "150g Hummus" },
            { canonicalKey: "carrot", qty: 100, unit: "g", display: "2 Carrots" },
            { canonicalKey: "cucumber", qty: 100, unit: "g", display: "½ Cucumber" },
            { canonicalKey: "pepper_bell", qty: 100, unit: "g", display: "½ Bell pepper" }
        ],
        
        display: {
            emoji: "🥕",
            description: "Healthy veggie sticks with creamy hummus",
            time: "5 mins",
            servings: "2",
            instructions: [
                "Wash all vegetables",
                "Cut into sticks",
                "Arrange on plate",
                "Serve hummus in bowl for dipping"
            ],
            tips: [
                "Use any vegetables",
                "Add breadsticks for variety",
                "Make your own hummus"
            ],
            video: "",
            nutrition: "Per serving: 140 cal, 6g protein, 6g fat, 16g carbs"
        }
    },
    
    RS4: {
        id: "RS4",
        name: "Popcorn",
        category: "snacks",
        serves: 2,
        prepTime: "2 mins",
        cookTime: "5 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "popcorn_kernels", qty: 60, unit: "g", display: "60g Popcorn kernels" },
            { canonicalKey: "vegetable_oil", qty: 20, unit: "ml", display: "1 tbsp Oil" },
            { canonicalKey: "salt", qty: 2, unit: "g", display: "Salt to taste" }
        ],
        
        display: {
            emoji: "🍿",
            description: "Homemade popcorn - better than microwave",
            time: "7 mins",
            servings: "2",
            instructions: [
                "Heat oil in large pot with lid",
                "Add 3 kernels, cover",
                "When they pop, add rest",
                "Shake pan frequently",
                "When popping slows, remove from heat",
                "Season with salt",
                "Serve in bowl"
            ],
            tips: [
                "Don't lift lid while popping",
                "Add butter for movie popcorn",
                "Try sweet: add sugar & cinnamon"
            ],
            video: "",
            nutrition: "Per serving: 180 cal, 3g protein, 10g fat, 22g carbs"
        }
    },
    
    RS5: {
        id: "RS5",
        name: "Banana with Honey",
        category: "snacks",
        serves: 1,
        prepTime: "2 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "banana", qty: 120, unit: "g", display: "1 Banana" },
            { canonicalKey: "honey", qty: 15, unit: "g", display: "1 tbsp Honey" }
        ],
        
        display: {
            emoji: "🍌",
            description: "Simple sweet snack - natural energy boost",
            time: "2 mins",
            servings: "1",
            instructions: [
                "Peel banana",
                "Slice or eat whole",
                "Drizzle honey over",
                "Enjoy immediately"
            ],
            tips: [
                "Add cinnamon",
                "Top with yogurt",
                "Freeze for ice cream alternative"
            ],
            video: "",
            nutrition: "Per serving: 180 cal, 1g protein, 0g fat, 45g carbs"
        }
    },
    
    RS6: {
        id: "RS6",
        name: "Trail Mix",
        category: "snacks",
        serves: 4,
        prepTime: "5 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: true,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "almonds", qty: 80, unit: "g", display: "80g Almonds" },
            { canonicalKey: "raisins", qty: 60, unit: "g", display: "60g Raisins" },
            { canonicalKey: "peanuts", qty: 60, unit: "g", display: "60g Peanuts" },
            { canonicalKey: "chocolate_chips", qty: 40, unit: "g", display: "40g Chocolate chips" }
        ],
        
        display: {
            emoji: "🥜",
            description: "DIY trail mix - perfect portable snack",
            time: "5 mins",
            servings: "4",
            instructions: [
                "Mix all ingredients in bowl",
                "Portion into 4 servings",
                "Store in airtight container",
                "Grab and go"
            ],
            tips: [
                "Use any nuts you like",
                "Add dried cranberries",
                "Keep portions controlled"
            ],
            video: "",
            nutrition: "Per serving: 280 cal, 8g protein, 18g fat, 24g carbs"
        }
    },
    
    RS7: {
        id: "RS7",
        name: "Rice Cakes with Avocado",
        category: "snacks",
        serves: 1,
        prepTime: "3 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: true,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "rice_cakes", qty: 2, unit: "count", display: "2 Rice cakes" },
            { canonicalKey: "avocado", qty: 100, unit: "g", display: "½ Avocado" },
            { canonicalKey: "lemon_juice", qty: 5, unit: "ml", display: "Squeeze lemon" },
            { canonicalKey: "salt", qty: 1, unit: "g", display: "Pinch salt" }
        ],
        
        display: {
            emoji: "🥑",
            description: "Light healthy snack - creamy avocado on crispy rice cakes",
            time: "3 mins",
            servings: "1",
            instructions: [
                "Mash avocado with fork",
                "Add lemon juice, salt",
                "Spread on rice cakes",
                "Serve immediately"
            ],
            tips: [
                "Add cherry tomatoes",
                "Sprinkle chili flakes",
                "Top with seeds"
            ],
            video: "",
            nutrition: "Per serving: 180 cal, 4g protein, 12g fat, 16g carbs"
        }
    },
    
    RS8: {
        id: "RS8",
        name: "Boiled Eggs",
        category: "snacks",
        serves: 1,
        prepTime: "1 min",
        cookTime: "10 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: false,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "egg", qty: 2, unit: "count", display: "2 Eggs" },
            { canonicalKey: "salt", qty: 1, unit: "g", display: "Salt & pepper" }
        ],
        
        display: {
            emoji: "🥚",
            description: "Protein-packed snack - simple hard boiled eggs",
            time: "11 mins",
            servings: "1",
            instructions: [
                "Place eggs in pan, cover with cold water",
                "Bring to boil",
                "Boil 10 mins",
                "Transfer to ice water",
                "Peel when cool",
                "Season with salt, pepper"
            ],
            tips: [
                "Fresh eggs are harder to peel",
                "Add to salads",
                "Keep batch in fridge"
            ],
            video: "",
            nutrition: "Per serving: 140 cal, 12g protein, 10g fat, 1g carbs"
        }
    },
    
    // ========================================
    // REWARD RECIPES (RW1-RW5) - 5 recipes
    // ========================================
    
    RW1: {
        id: "RW1",
        name: "Chocolate Chip Cookies",
        category: "rewards",
        serves: 12,
        prepTime: "15 mins",
        cookTime: "12 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "flour_plain", qty: 200, unit: "g", display: "200g Plain flour" },
            { canonicalKey: "butter", qty: 100, unit: "g", display: "100g Butter (softened)" },
            { canonicalKey: "sugar_brown", qty: 100, unit: "g", display: "100g Brown sugar" },
            { canonicalKey: "sugar_white", qty: 50, unit: "g", display: "50g White sugar" },
            { canonicalKey: "egg", qty: 1, unit: "count", display: "1 Egg" },
            { canonicalKey: "chocolate_chips", qty: 150, unit: "g", display: "150g Chocolate chips" },
            { canonicalKey: "baking_powder", qty: 5, unit: "g", display: "1 tsp Baking powder" },
            { canonicalKey: "vanilla_extract", qty: 5, unit: "ml", display: "1 tsp Vanilla" }
        ],
        
        display: {
            emoji: "🍪",
            description: "Classic chewy chocolate chip cookies - everyone's favorite",
            time: "27 mins",
            servings: "12 cookies",
            instructions: [
                "Preheat oven to 180°C",
                "Cream butter and sugars until fluffy",
                "Beat in egg and vanilla",
                "Mix flour and baking powder",
                "Fold dry into wet ingredients",
                "Stir in chocolate chips",
                "Drop spoonfuls on baking tray",
                "Bake 12 mins until golden",
                "Cool on tray 5 mins"
            ],
            tips: [
                "Don't overbake - they firm up while cooling",
                "Chill dough 30 mins for thicker cookies",
                "Use good quality chocolate"
            ],
            video: "",
            nutrition: "Per cookie: 180 cal, 2g protein, 8g fat, 25g carbs"
        }
    },
    
    RW2: {
        id: "RW2",
        name: "Brownies",
        category: "rewards",
        serves: 16,
        prepTime: "15 mins",
        cookTime: "25 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "dark_chocolate", qty: 200, unit: "g", display: "200g Dark chocolate" },
            { canonicalKey: "butter", qty: 150, unit: "g", display: "150g Butter" },
            { canonicalKey: "sugar_white", qty: 200, unit: "g", display: "200g Sugar" },
            { canonicalKey: "egg", qty: 3, unit: "count", display: "3 Eggs" },
            { canonicalKey: "flour_plain", qty: 100, unit: "g", display: "100g Plain flour" },
            { canonicalKey: "cocoa_powder", qty: 30, unit: "g", display: "30g Cocoa powder" }
        ],
        
        display: {
            emoji: "🍫",
            description: "Fudgy chocolate brownies - rich and indulgent",
            time: "40 mins",
            servings: "16 pieces",
            instructions: [
                "Preheat oven to 180°C",
                "Line 20cm square tin",
                "Melt chocolate and butter",
                "Whisk in sugar",
                "Beat in eggs one at a time",
                "Fold in flour and cocoa",
                "Pour into tin",
                "Bake 25 mins (still wobbly)",
                "Cool completely before cutting"
            ],
            tips: [
                "Don't overbake for fudgy texture",
                "Add walnuts if desired",
                "Best served warm with ice cream"
            ],
            video: "",
            nutrition: "Per piece: 180 cal, 3g protein, 10g fat, 22g carbs"
        }
    },
    
    RW3: {
        id: "RW3",
        name: "Vanilla Cupcakes",
        category: "rewards",
        serves: 12,
        prepTime: "20 mins",
        cookTime: "18 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "flour_plain", qty: 150, unit: "g", display: "150g Plain flour" },
            { canonicalKey: "butter", qty: 100, unit: "g", display: "100g Butter (softened)" },
            { canonicalKey: "sugar_white", qty: 150, unit: "g", display: "150g Sugar" },
            { canonicalKey: "egg", qty: 2, unit: "count", display: "2 Eggs" },
            { canonicalKey: "milk", qty: 60, unit: "ml", display: "60ml Milk" },
            { canonicalKey: "baking_powder", qty: 10, unit: "g", display: "2 tsp Baking powder" },
            { canonicalKey: "vanilla_extract", qty: 5, unit: "ml", display: "1 tsp Vanilla" }
        ],
        
        display: {
            emoji: "🧁",
            description: "Light fluffy cupcakes - perfect for parties",
            time: "38 mins",
            servings: "12 cupcakes",
            instructions: [
                "Preheat oven to 180°C",
                "Line muffin tin with cases",
                "Cream butter and sugar",
                "Beat in eggs and vanilla",
                "Fold in flour and baking powder",
                "Add milk, mix until smooth",
                "Divide between cases",
                "Bake 18 mins until golden",
                "Cool and frost"
            ],
            tips: [
                "Test with toothpick for doneness",
                "Frost when completely cool",
                "Add sprinkles for fun"
            ],
            video: "",
            nutrition: "Per cupcake: 160 cal, 2g protein, 8g fat, 20g carbs"
        }
    },
    
    RW4: {
        id: "RW4",
        name: "Ice Cream Sundae",
        category: "rewards",
        serves: 2,
        prepTime: "5 mins",
        cookTime: "0 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: false
        },
        
        ingredients: [
            { canonicalKey: "ice_cream_vanilla", qty: 400, unit: "g", display: "400g Vanilla ice cream" },
            { canonicalKey: "chocolate_sauce", qty: 60, unit: "ml", display: "4 tbsp Chocolate sauce" },
            { canonicalKey: "whipped_cream", qty: 100, unit: "g", display: "Whipped cream" },
            { canonicalKey: "sprinkles", qty: 20, unit: "g", display: "Sprinkles" }
        ],
        
        display: {
            emoji: "🍨",
            description: "Classic ice cream sundae - fun dessert for hot days",
            time: "5 mins",
            servings: "2",
            instructions: [
                "Scoop ice cream into bowls",
                "Drizzle chocolate sauce",
                "Add whipped cream on top",
                "Sprinkle with sprinkles",
                "Add cherry if desired",
                "Serve immediately"
            ],
            tips: [
                "Use different ice cream flavors",
                "Add fresh berries",
                "Crush cookies for topping"
            ],
            video: "",
            nutrition: "Per serving: 480 cal, 6g protein, 24g fat, 62g carbs"
        }
    },
    
    RW5: {
        id: "RW5",
        name: "Apple Crumble",
        category: "rewards",
        serves: 6,
        prepTime: "15 mins",
        cookTime: "35 mins",
        
        dietary: {
            vegetarian: true,
            vegan: false,
            nuts: false,
            dairy: true,
            gluten: true
        },
        
        ingredients: [
            { canonicalKey: "apple", qty: 600, unit: "g", display: "4 Apples" },
            { canonicalKey: "flour_plain", qty: 150, unit: "g", display: "150g Plain flour" },
            { canonicalKey: "butter", qty: 100, unit: "g", display: "100g Butter" },
            { canonicalKey: "sugar_white", qty: 100, unit: "g", display: "100g Sugar" },
            { canonicalKey: "cinnamon", qty: 5, unit: "g", display: "1 tsp Cinnamon" }
        ],
        
        display: {
            emoji: "🍏",
            description: "Warm apple crumble - classic British dessert",
            time: "50 mins",
            servings: "6",
            instructions: [
                "Preheat oven to 180°C",
                "Peel and slice apples",
                "Place in baking dish",
                "Sprinkle with cinnamon and half sugar",
                "Rub butter into flour until crumbs",
                "Mix in remaining sugar",
                "Sprinkle crumble over apples",
                "Bake 35 mins until golden",
                "Serve warm with custard"
            ],
            tips: [
                "Add raisins to apple layer",
                "Use oats in crumble for texture",
                "Best served with ice cream"
            ],
            video: "",
            nutrition: "Per serving: 320 cal, 3g protein, 14g fat, 48g carbs"
        }
    }
};

// Get recipe by ID
function getRecipe(recipeId) {
    return RECIPE_DATABASE[recipeId] || null;
}

// Get all recipes
function getAllRecipes() {
    return RECIPE_DATABASE;
}

// Get recipes by category
function getRecipesByCategory(category) {
    return Object.values(RECIPE_DATABASE).filter(recipe => recipe.category === category);
}

console.log('✅ Recipe Database loaded - 50+ recipes across 6 categories');
