// ================================================
// INGREDIENT KEYWORD MAPPINGS (COMMON ITEMS)
// Used to infer shopping items when recipes lack quickAddItems
// Preferred shop first, Tesco fallback, else flagged for "buy elsewhere"
// ================================================

function makeEntry(keywords, itemName, category, unit, qtyNeeded = 1, shops = ['Tesco']) {
    const entries = {};
    shops.forEach(shop => {
        entries[shop] = { category, itemName, unit, qtyNeeded };
    });
    return { keywords, entries };
}

// Core mapping (~200+ common ingredients and variants)
const ingredientKeywordMap = [
    // Bakery & carbs
    makeEntry(['bread', 'toast', 'loaf'], 'White Toastie Bread Thick Sliced', '🍞 Bread & Bakery', 'loaf of 800g'),
    makeEntry(['baguette'], 'White Baguette', '🍞 Bread & Bakery', '300g'),
    makeEntry(['roll', 'bun'], 'White Rolls', '🍞 Bread & Bakery', '6 pack'),
    makeEntry(['pita', 'pitta'], 'White Pitta Bread', '🍞 Bread & Bakery', '6 pack'),
    makeEntry(['naan'], 'Plain Naan Bread', '🍞 Bread & Bakery', '2 pack'),
    makeEntry(['tortilla', 'wrap'], 'Nevills Plain White Tortilla', '🍞 Bread & Bakery', 'pack of 8'),
    makeEntry(['flatbread'], 'Greek Style Flatbread', '🍞 Bread & Bakery', 'pack of 6'),
    makeEntry(['bagel'], 'Plain Bagels', '🍞 Bread & Bakery', 'pack of 5'),
    makeEntry(['croissant'], 'Nevills Plain Croissants', '🍞 Bread & Bakery', 'pack of 8'),
    makeEntry(['cracker'], 'Cream Crackers', '🚀 Pantry & Staples', '300g'),
    makeEntry(['pasta', 'penne'], 'Pasta (Penne)', '🚀 Pantry & Staples', '500g'),
    makeEntry(['spaghetti'], 'Spaghetti', '🚀 Pantry & Staples', '500g'),
    makeEntry(['macaroni'], 'Macaroni', '🚀 Pantry & Staples', '500g'),
    makeEntry(['lasagne', 'lasagna'], 'Lasagne Sheets', '🚀 Pantry & Staples', '500g'),
    makeEntry(['rice', 'long grain'], 'Long Grain Rice', '🚀 Pantry & Staples', '1kg'),
    makeEntry(['basmati'], 'Basmati Rice', '🚀 Pantry & Staples', '1kg'),
    makeEntry(['brown rice'], 'Brown Rice', '🚀 Pantry & Staples', '1kg'),
    makeEntry(['risotto', 'arborio'], 'Arborio Risotto Rice', '🚀 Pantry & Staples', '500g'),
    makeEntry(['quinoa'], 'Quinoa', '🚀 Pantry & Staples', '500g'),
    makeEntry(['couscous'], 'Couscous', '🚀 Pantry & Staples', '500g'),
    makeEntry(['bulgur', 'bulghur'], 'Bulgur Wheat', '🚀 Pantry & Staples', '500g'),
    makeEntry(['buckwheat'], 'Buckwheat Groats', '🚀 Pantry & Staples', '1kg'),
    makeEntry(['oats', 'porridge', 'oatmeal'], 'Porridge Oats', '🚀 Pantry & Staples', '1kg'),
    makeEntry(['flour', 'plain flour'], 'Flour (Plain)', '🚀 Pantry & Staples', '1kg'),
    makeEntry(['self-raising', 'self raising'], 'Self Raising Flour', '🚀 Pantry & Staples', '1kg'),
    makeEntry(['wholemeal flour'], 'Wholemeal Flour', '🚀 Pantry & Staples', '1kg'),
    makeEntry(['cornflour', 'corn starch'], 'Cornflour', '🚀 Pantry & Staples', '500g'),
    makeEntry(['baking powder'], 'Baking Powder', '🚀 Pantry & Staples', '170g'),
    makeEntry(['bicarbonate', 'baking soda'], 'Bicarbonate of Soda', '🚀 Pantry & Staples', '200g'),
    makeEntry(['yeast'], 'Dried Yeast', '🚀 Pantry & Staples', '64g'),
    makeEntry(['breadcrumbs'], 'Golden Breadcrumbs', '🚀 Pantry & Staples', '400g'),
    makeEntry(['polenta', 'cornmeal'], 'Polenta', '🚀 Pantry & Staples', '500g'),
    makeEntry(['tapioca'], 'Tapioca Flour', '🚀 Pantry & Staples', '500g'),
    makeEntry(['noodle', 'udon'], 'Udon Noodles', '🚀 Pantry & Staples', '300g'),
    makeEntry(['rice noodle'], 'Rice Noodles', '🚀 Pantry & Staples', '300g'),
    makeEntry(['egg noodle'], 'Egg Noodles', '🚀 Pantry & Staples', '300g'),
    makeEntry(['tortellini'], 'Fresh Tortellini', '🚀 Pantry & Staples', '300g'),
    makeEntry(['gnocchi'], 'Potato Gnocchi', '🚀 Pantry & Staples', '500g'),

    // Dairy & eggs
    makeEntry(['milk'], 'Milk (Semi-Skimmed)', '🥛 Dairy & Eggs', '2.272L'),
    makeEntry(['whole milk'], 'Milk (Whole)', '🥛 Dairy & Eggs', '2.272L'),
    makeEntry(['skimmed milk'], 'Milk (Skimmed)', '🥛 Dairy & Eggs', '2.272L'),
    makeEntry(['cream', 'double cream'], 'Double Cream', '🥛 Dairy & Eggs', '300ml'),
    makeEntry(['single cream'], 'Single Cream', '🥛 Dairy & Eggs', '300ml'),
    makeEntry(['sour cream'], 'Soured Cream', '🥛 Dairy & Eggs', '300ml'),
    makeEntry(['yogurt', 'yoghurt'], 'Natural Yogurt', '🥛 Dairy & Eggs', '500g'),
    makeEntry(['greek yogurt'], 'Greek Style Yogurt', '🥛 Dairy & Eggs', '500g'),
    makeEntry(['butter'], 'BUTTERPAK', '🥛 Dairy & Eggs', '500g'),
    makeEntry(['margarine'], 'Spreadable Margarine', '🥛 Dairy & Eggs', '500g'),
    makeEntry(['cheddar', 'cheese'], 'Mature Cheddar', '🥛 Dairy & Eggs', '400g'),
    makeEntry(['mozzarella'], 'Mozzarella Ball', '🥛 Dairy & Eggs', '125g'),
    makeEntry(['parmesan', 'parmigiano'], 'Parmesan Wedge', '🥛 Dairy & Eggs', '200g'),
    makeEntry(['feta'], 'Feta Cheese', '🥛 Dairy & Eggs', '200g'),
    makeEntry(['halloumi'], 'Halloumi', '🥛 Dairy & Eggs', '225g'),
    makeEntry(['ricotta'], 'Ricotta', '🥛 Dairy & Eggs', '250g'),
    makeEntry(['cream cheese', 'philadelphia'], 'Cream Cheese', '🥛 Dairy & Eggs', '200g'),
    makeEntry(['cottage', 'cheese', 'tvorog'], 'Cottage Cheese', '🥛 Dairy & Eggs', '300g'),
    makeEntry(['buttermilk'], 'Buttermilk', '🥛 Dairy & Eggs', '500ml'),
    makeEntry(['egg'], 'British Barn Eggs', '🥛 Dairy & Eggs', 'pack of 10'),
    makeEntry(['evaporated milk'], 'Evaporated Milk', '🥛 Dairy & Eggs', '410g tin'),
    makeEntry(['condensed milk'], 'Sweetened Condensed Milk', '🥛 Dairy & Eggs', '397g'),
    makeEntry(['custard'], 'Fresh Custard', '🥛 Dairy & Eggs', '500g'),

    // Meat, fish & deli
    makeEntry(['chicken breast'], 'Chicken Breast', '🍖 Meat & Fish', 'kg', 0.5),
    makeEntry(['chicken thigh'], 'Chicken Thigh Fillets', '🍖 Meat & Fish', 'kg', 0.6),
    makeEntry(['whole chicken'], 'Whole Chicken', '🍖 Meat & Fish', '1.4kg', 1),
    makeEntry(['mince', 'ground beef'], 'Beef Mince 5%', '🍖 Meat & Fish', '500g'),
    makeEntry(['mince pork', 'ground pork'], 'Pork Mince', '🍖 Meat & Fish', '500g'),
    makeEntry(['lamb'], 'Lamb Mince', '🍖 Meat & Fish', '500g'),
    makeEntry(['turkey mince'], 'Turkey Mince', '🍖 Meat & Fish', '500g'),
    makeEntry(['sausage'], 'Pork Sausages', '🍖 Meat & Fish', 'pack', 1),
    makeEntry(['bacon'], 'Smoked Back Bacon', '🍖 Meat & Fish', '300g'),
    makeEntry(['ham'], 'Sliced Cooked Ham', '🍖 Meat & Fish', '300g'),
    makeEntry(['salami'], 'Salami Slices', '🍖 Meat & Fish', '120g'),
    makeEntry(['chorizo'], 'Chorizo Ring', '🍖 Meat & Fish', '225g'),
    makeEntry(['pepperoni'], 'Pepperoni Slices', '🍖 Meat & Fish', '120g'),
    makeEntry(['beef steak'], 'Rump Steak', '🍖 Meat & Fish', '400g'),
    makeEntry(['pork chop'], 'Pork Loin Steaks', '🍖 Meat & Fish', '450g'),
    makeEntry(['meatball'], 'Beef Meatballs', '🍖 Meat & Fish', '400g'),
    makeEntry(['hot dog'], 'Hot Dog Sausages', '🍖 Meat & Fish', '400g tin'),
    makeEntry(['cod'], 'Cod Fillets', '🍖 Meat & Fish', '300g'),
    makeEntry(['salmon'], 'Salmon Fillets', '🍖 Meat & Fish', '300g'),
    makeEntry(['white fish'], 'White Fish', '🍖 Meat & Fish', 'kg', 0.3),
    makeEntry(['tuna'], 'Tuna Chunks in Brine', '🚀 Pantry & Staples', '4x145g', 1),
    makeEntry(['prawns', 'shrimp'], 'Cooked King Prawns', '🍖 Meat & Fish', '200g'),
    makeEntry(['mackerel'], 'Smoked Mackerel Fillets', '🍖 Meat & Fish', '200g'),
    makeEntry(['anchovy'], 'Anchovy Fillets', '🍖 Meat & Fish', '50g'),
    makeEntry(['sardine'], 'Sardines in Tomato Sauce', '🚀 Pantry & Staples', '120g tin'),

    // Vegetables & fruit
    makeEntry(['avocado'], 'Avocado (Ripe & Ready)', '🥬 Vegetables', 'each'),
    makeEntry(['tomato'], 'Tomatoes', '🥬 Vegetables', 'kg', 0.3),
    makeEntry(['cherry tomato'], 'Cherry Tomatoes', '🥬 Vegetables', '250g'),
    makeEntry(['potato'], 'All Rounder Potatoes', '🥬 Vegetables', 'Pack of 2kg'),
    makeEntry(['sweet potato'], 'Sweet Potatoes', '🥬 Vegetables', '1kg'),
    makeEntry(['onion', 'brown onion'], 'BRITISH BROWN ONIONS', '🥬 Vegetables', 'kg', 0.3),
    makeEntry(['red onion'], 'Red Onions', '🥬 Vegetables', 'kg', 0.3),
    makeEntry(['garlic'], 'Garlic', '🥬 Vegetables', 'each'),
    makeEntry(['ginger'], 'Ginger', '🥬 Vegetables', '100g'),
    makeEntry(['carrot'], 'Carrots', '🥬 Vegetables', 'kg', 0.5),
    makeEntry(['celery'], 'Celery', '🥬 Vegetables', 'bunch'),
    makeEntry(['cucumber'], 'Cucumber', '🥬 Vegetables', 'each'),
    makeEntry(['lettuce', 'romaine', 'iceberg'], 'Lettuce', '🥬 Vegetables', 'each'),
    makeEntry(['spinach'], 'Spinach', '🥬 Vegetables', '240g bag'),
    makeEntry(['kale'], 'Curly Kale', '🥬 Vegetables', '200g'),
    makeEntry(['cabbage'], 'White Cabbage', '🥬 Vegetables', 'each'),
    makeEntry(['red cabbage'], 'Red Cabbage', '🥬 Vegetables', 'each'),
    makeEntry(['broccoli'], 'Broccoli', '🥬 Vegetables', '350g'),
    makeEntry(['cauliflower'], 'Cauliflower', '🥬 Vegetables', 'each'),
    makeEntry(['pepper', 'bell pepper'], 'Mixed Bell Peppers', '🥬 Vegetables', '3 pack'),
    makeEntry(['chilli', 'chili'], 'Fresh Red Chilli', '🥬 Vegetables', '50g'),
    makeEntry(['mushroom'], 'Closed Cup Mushrooms', '🥬 Vegetables', '300g'),
    makeEntry(['courgette', 'zucchini'], 'Courgettes', '🥬 Vegetables', '2 pack'),
    makeEntry(['aubergine', 'eggplant'], 'Aubergine', '🥬 Vegetables', 'each'),
    makeEntry(['leek'], 'Leeks', '🥬 Vegetables', '500g'),
    makeEntry(['parsnip'], 'Parsnips', '🥬 Vegetables', '500g'),
    makeEntry(['butternut', 'squash'], 'Butternut Squash', '🥬 Vegetables', 'each'),
    makeEntry(['peas'], 'Frozen Garden Peas', '🥬 Vegetables', '1kg'),
    makeEntry(['corn', 'sweetcorn'], 'Sweetcorn Kernels', '🥬 Vegetables', '500g'),
    makeEntry(['green bean', 'fine bean'], 'Fine Green Beans', '🥬 Vegetables', '220g'),
    makeEntry(['edamame', 'soybean'], 'Edamame Beans', '🥬 Vegetables', '500g'),
    makeEntry(['herb', 'parsley'], 'Fresh Parsley', '🥬 Vegetables', '30g'),
    makeEntry(['coriander', 'cilantro'], 'Fresh Coriander', '🥬 Vegetables', '30g'),
    makeEntry(['basil'], 'Fresh Basil', '🥬 Vegetables', '28g'),
    makeEntry(['mint'], 'Fresh Mint', '🥬 Vegetables', '28g'),
    makeEntry(['dill'], 'Fresh Dill', '🥬 Vegetables', '28g'),
    makeEntry(['rosemary'], 'Fresh Rosemary', '🥬 Vegetables', '20g'),
    makeEntry(['thyme'], 'Fresh Thyme', '🥬 Vegetables', '20g'),
    makeEntry(['lime'], 'Limes', '🥬 Vegetables', '4 pack'),
    makeEntry(['lemon'], 'Lemons', '🥬 Vegetables', '4 pack'),
    makeEntry(['orange'], 'Oranges', '🥬 Vegetables', '6 pack'),
    makeEntry(['apple'], 'Braeburn Apples', '🥬 Vegetables', '6 pack'),
    makeEntry(['banana'], 'Bananas', '🥬 Vegetables', '7 pack'),
    makeEntry(['grape'], 'Red Seedless Grapes', '🥬 Vegetables', '500g'),
    makeEntry(['blueberry'], 'Blueberries', '🥬 Vegetables', '200g'),
    makeEntry(['strawberry'], 'Strawberries', '🥬 Vegetables', '400g'),
    makeEntry(['raspberry'], 'Raspberries', '🥬 Vegetables', '200g'),
    makeEntry(['pear'], 'Pears', '🥬 Vegetables', '6 pack'),
    makeEntry(['pineapple'], 'Pineapple', '🥬 Vegetables', 'each'),
    makeEntry(['mango'], 'Mango (Ripe & Ready)', '🥬 Vegetables', 'each'),
    makeEntry(['avocado'], 'Avocado (Ripe & Ready)', '🥬 Vegetables', 'each'),
    makeEntry(['lime juice', 'bottled lime'], 'Lime Juice', '🚀 Pantry & Staples', '250ml'),
    makeEntry(['lemon juice'], 'Lemon Juice', '🚀 Pantry & Staples', '250ml'),

    // Pantry staples & tins
    makeEntry(['salt'], 'BRITISH COOKING SALT', '🚀 Pantry & Staples', '1.5kg', 0.1),
    makeEntry(['pepper'], 'Ground Black Pepper', '🚀 Pantry & Staples', '50g'),
    makeEntry(['chilli flakes'], 'Chilli Flakes', '🚀 Pantry & Staples', '40g'),
    makeEntry(['paprika'], 'Paprika', '🚀 Pantry & Staples', '75g'),
    makeEntry(['smoked paprika'], 'Smoked Paprika', '🚀 Pantry & Staples', '75g'),
    makeEntry(['cumin'], 'Ground Cumin', '🚀 Pantry & Staples', '70g'),
    makeEntry(['coriander powder'], 'Ground Coriander', '🚀 Pantry & Staples', '70g'),
    makeEntry(['turmeric'], 'Ground Turmeric', '🚀 Pantry & Staples', '70g'),
    makeEntry(['curry powder'], 'Curry Powder', '🚀 Pantry & Staples', '100g'),
    makeEntry(['garam masala'], 'Garam Masala', '🚀 Pantry & Staples', '100g'),
    makeEntry(['oregano'], 'Dried Oregano', '🚀 Pantry & Staples', '14g'),
    makeEntry(['mixed herbs'], 'Mixed Herbs', '🚀 Pantry & Staples', '18g'),
    makeEntry(['bay leaf'], 'Bay Leaves', '🚀 Pantry & Staples', '5g'),
    makeEntry(['cinnamon'], 'Ground Cinnamon', '🚀 Pantry & Staples', '40g'),
    makeEntry(['nutmeg'], 'Ground Nutmeg', '🚀 Pantry & Staples', '25g'),
    makeEntry(['allspice'], 'Ground Allspice', '🚀 Pantry & Staples', '40g'),
    makeEntry(['cardamom'], 'Cardamom Pods', '🚀 Pantry & Staples', '35g'),
    makeEntry(['cloves'], 'Whole Cloves', '🚀 Pantry & Staples', '40g'),
    makeEntry(['vanilla'], 'Vanilla Extract', '🚀 Pantry & Staples', '38ml'),
    makeEntry(['sugar'], 'Sugar (White)', '🚀 Pantry & Staples', '1kg'),
    makeEntry(['brown sugar'], 'Light Brown Soft Sugar', '🚀 Pantry & Staples', '500g'),
    makeEntry(['icing sugar', 'powdered sugar'], 'Icing Sugar', '🚀 Pantry & Staples', '500g'),
    makeEntry(['honey'], 'Clear Honey', '🚀 Pantry & Staples', '340g'),
    makeEntry(['maple syrup'], 'Maple Syrup', '🚀 Pantry & Staples', '250ml'),
    makeEntry(['golden syrup'], 'Golden Syrup', '🚀 Pantry & Staples', '454g'),
    makeEntry(['peanut butter'], 'Smooth Peanut Butter', '🚀 Pantry & Staples', '340g'),
    makeEntry(['almond butter'], 'Almond Butter', '🚀 Pantry & Staples', '170g'),
    makeEntry(['tahini'], 'Tahini', '🚀 Pantry & Staples', '300g'),
    makeEntry(['olive oil'], 'Olive Oil', '🚀 Pantry & Staples', '500ml'),
    makeEntry(['rapeseed oil', 'vegetable oil'], 'Vegetable Oil', '🚀 Pantry & Staples', '1L'),
    makeEntry(['sesame oil'], 'Sesame Oil', '🚀 Pantry & Staples', '250ml'),
    makeEntry(['soy sauce'], 'Soy Sauce', '🚀 Pantry & Staples', '150ml'),
    makeEntry(['dark soy'], 'Dark Soy Sauce', '🚀 Pantry & Staples', '150ml'),
    makeEntry(['light soy'], 'Light Soy Sauce', '🚀 Pantry & Staples', '150ml'),
    makeEntry(['fish sauce'], 'Fish Sauce', '🚀 Pantry & Staples', '200ml'),
    makeEntry(['oyster sauce'], 'Oyster Sauce', '🚀 Pantry & Staples', '255g'),
    makeEntry(['hoisin'], 'Hoisin Sauce', '🚀 Pantry & Staples', '260g'),
    makeEntry(['sriracha'], 'Sriracha Sauce', '🚀 Pantry & Staples', '455ml'),
    makeEntry(['ketchup', 'tomato ketchup'], 'Tomato Ketchup', '🚀 Pantry & Staples', '500g'),
    makeEntry(['mayonnaise'], 'Mayonnaise', '🚀 Pantry & Staples', '500ml'),
    makeEntry(['mustard'], 'Dijon Mustard', '🚀 Pantry & Staples', '215g'),
    makeEntry(['wholegrain mustard'], 'Wholegrain Mustard', '🚀 Pantry & Staples', '185g'),
    makeEntry(['vinegar', 'white vinegar'], 'White Wine Vinegar', '🚀 Pantry & Staples', '350ml'),
    makeEntry(['balsamic'], 'Balsamic Vinegar', '🚀 Pantry & Staples', '250ml'),
    makeEntry(['red wine vinegar'], 'Red Wine Vinegar', '🚀 Pantry & Staples', '350ml'),
    makeEntry(['apple cider vinegar'], 'Apple Cider Vinegar', '🚀 Pantry & Staples', '500ml'),
    makeEntry(['tomato puree', 'tomato paste'], 'Tomato Puree', '🚀 Pantry & Staples', '200g'),
    makeEntry(['passata'], 'Tomato Passata', '🚀 Pantry & Staples', '500g'),
    makeEntry(['tinned tomato', 'canned tomato'], 'Grower\'s Harvest Chopped Tomatoes', '🚀 Pantry & Staples', '400g tin'),
    makeEntry(['coconut milk'], 'Coconut Milk', '🚀 Pantry & Staples', '400ml tin'),
    makeEntry(['kidney bean'], 'Kidney Beans', '🚀 Pantry & Staples', '400g tin'),
    makeEntry(['black bean'], 'Black Beans', '🚀 Pantry & Staples', '400g tin'),
    makeEntry(['chickpea'], 'Chickpeas', '🚀 Pantry & Staples', '400g tin'),
    makeEntry(['butter bean'], 'Butter Beans', '🚀 Pantry & Staples', '400g tin'),
    makeEntry(['lentil'], 'Green Lentils', '🚀 Pantry & Staples', '400g tin'),
    makeEntry(['baked bean'], 'Baked Beans', '🚀 Pantry & Staples', '415g tin'),
    makeEntry(['stock cube', 'bouillon'], 'Vegetable Stock Cubes', '🚀 Pantry & Staples', '12 pack'),
    makeEntry(['chicken stock'], 'Chicken Stock Cubes', '🚀 Pantry & Staples', '12 pack'),
    makeEntry(['beef stock'], 'Beef Stock Cubes', '🚀 Pantry & Staples', '12 pack'),
    makeEntry(['pesto'], 'Green Pesto', '🚀 Pantry & Staples', '190g'),
    makeEntry(['red pesto'], 'Red Pesto', '🚀 Pantry & Staples', '190g'),
    makeEntry(['capers'], 'Capers', '🚀 Pantry & Staples', '180g'),
    makeEntry(['sun-dried', 'sundried'], 'Sun-Dried Tomatoes', '🚀 Pantry & Staples', '280g'),
    makeEntry(['gherkins', 'pickles'], 'Pickled Gherkins', '🚀 Pantry & Staples', '670g'),
    makeEntry(['olives'], 'Pitted Green Olives', '🚀 Pantry & Staples', '340g'),
    makeEntry(['raisins'], 'Raisins', '🚀 Pantry & Staples', '500g'),
    makeEntry(['sultanas'], 'Sultanas', '🚀 Pantry & Staples', '500g'),
    makeEntry(['dates'], 'Medjool Dates', '🚀 Pantry & Staples', '200g'),
    makeEntry(['apricot'], 'Dried Apricots', '🚀 Pantry & Staples', '250g'),
    makeEntry(['walnut'], 'Walnut Halves', '🚀 Pantry & Staples', '200g'),
    makeEntry(['almond'], 'Almonds', '🚀 Pantry & Staples', '200g'),
    makeEntry(['cashew'], 'Cashew Nuts', '🚀 Pantry & Staples', '200g'),
    makeEntry(['peanut'], 'Roasted Peanuts', '🚀 Pantry & Staples', '200g'),
    makeEntry(['pistachio'], 'Pistachios', '🚀 Pantry & Staples', '200g'),
    makeEntry(['sesame seed'], 'Sesame Seeds', '🚀 Pantry & Staples', '100g'),
    makeEntry(['chia'], 'Chia Seeds', '🚀 Pantry & Staples', '300g'),
    makeEntry(['pumpkin seed'], 'Pumpkin Seeds', '🚀 Pantry & Staples', '200g'),
    makeEntry(['sunflower seed'], 'Sunflower Seeds', '🚀 Pantry & Staples', '200g'),
    makeEntry(['oats', 'granola'], 'Crunchy Granola', '🚀 Pantry & Staples', '500g'),
    makeEntry(['cocoa', 'cacao'], 'Cocoa Powder', '🚀 Pantry & Staples', '250g'),
    makeEntry(['chocolate chips'], 'Dark Chocolate Chips', '🚀 Pantry & Staples', '200g'),
    makeEntry(['gelatine'], 'Gelatine Leaves', '🚀 Pantry & Staples', '20g'),
    makeEntry(['coconut oil'], 'Coconut Oil', '🚀 Pantry & Staples', '300ml'),
    makeEntry(['tapioca pearls'], 'Tapioca Pearls', '🚀 Pantry & Staples', '400g'),

    // Dairy alternatives & misc
    makeEntry(['soya milk', 'soy milk'], 'Soya Drink', '🥛 Dairy & Eggs', '1L'),
    makeEntry(['almond milk'], 'Almond Drink', '🥛 Dairy & Eggs', '1L'),
    makeEntry(['oat milk'], 'Oat Drink', '🥛 Dairy & Eggs', '1L'),
    makeEntry(['coconut milk drink'], 'Coconut Drink', '🥛 Dairy & Eggs', '1L'),
    makeEntry(['vegan cheese'], 'Vegan Cheddar Alternative', '🥛 Dairy & Eggs', '200g'),
    makeEntry(['vegan yogurt'], 'Coconut Yogurt', '🥛 Dairy & Eggs', '400g'),
    makeEntry(['tofu'], 'Firm Tofu', '🍖 Meat & Fish', '396g'),
    makeEntry(['tempeh'], 'Tempeh', '🍖 Meat & Fish', '200g'),

    // Breakfast & snacks
    makeEntry(['jam', 'preserve'], 'Strawberry Jam', '🚀 Pantry & Staples', '454g'),
    makeEntry(['peanut butter'], 'Smooth Peanut Butter', '🚀 Pantry & Staples', '340g'),
    makeEntry(['cereal'], 'Cornflakes', '🚀 Pantry & Staples', '500g'),
    makeEntry(['muesli'], 'Fruit Muesli', '🚀 Pantry & Staples', '750g'),
    makeEntry(['tea'], 'Tea Bags', '🥤 Drinks', '80 pack'),
    makeEntry(['coffee'], 'Instant Coffee', '🥤 Drinks', '200g'),
    makeEntry(['hot chocolate'], 'Drinking Chocolate', '🥤 Drinks', '300g'),

    // Drinks
    makeEntry(['water'], 'Still Water', '🥤 Drinks', '2L'),
    makeEntry(['sparkling water'], 'Sparkling Water', '🥤 Drinks', '2L'),
    makeEntry(['orange juice'], 'Orange Juice', '🥤 Drinks', '1L'),
    makeEntry(['apple juice'], 'Apple Juice', '🥤 Drinks', '1L'),
    makeEntry(['cola'], 'Cola', '🥤 Drinks', '2L'),

    // Baking extras
    makeEntry(['chocolate bar'], 'Dark Chocolate Bar', '🚀 Pantry & Staples', '100g'),
    makeEntry(['white chocolate'], 'White Chocolate Bar', '🚀 Pantry & Staples', '100g'),
    makeEntry(['milk chocolate'], 'Milk Chocolate Bar', '🚀 Pantry & Staples', '100g'),
    makeEntry(['sprinkles'], 'Cake Sprinkles', '🚀 Pantry & Staples', '100g'),
    makeEntry(['desiccated coconut'], 'Desiccated Coconut', '🚀 Pantry & Staples', '200g'),
    makeEntry(['custard powder'], 'Custard Powder', '🚀 Pantry & Staples', '300g'),
    makeEntry(['marshmallow'], 'Marshmallows', '🚀 Pantry & Staples', '200g'),

    // Frozen essentials
    makeEntry(['frozen peas'], 'Frozen Garden Peas', '🥬 Vegetables', '1kg'),
    makeEntry(['frozen sweetcorn'], 'Frozen Sweetcorn', '🥬 Vegetables', '1kg'),
    makeEntry(['frozen berries'], 'Frozen Mixed Berries', '🥬 Vegetables', '500g'),
    makeEntry(['frozen spinach'], 'Frozen Spinach', '🥬 Vegetables', '450g'),
    makeEntry(['frozen chips', 'fries'], 'Frozen Oven Chips', '🥬 Vegetables', '1.5kg'),
    makeEntry(['frozen pizza'], 'Margherita Pizza', '🍞 Bread & Bakery', '350g'),
    makeEntry(['ice cream'], 'Vanilla Ice Cream', '🥛 Dairy & Eggs', '1L')
];

function findIngredientKeywordMatch(ingredientText, preferredShop) {
    const tokens = ingredientKeywordsFromText
        ? ingredientKeywordsFromText(ingredientText)
        : (ingredientText || '').toLowerCase().split(/\s+/);
    if (!tokens.length) return null;
    
    let best = null;
    ingredientKeywordMap.forEach(entry => {
        const score = entry.keywords.reduce((acc, kw) => acc + (tokens.includes(kw) ? 1 : 0), 0);
        if (score === 0) return;
        const targetShop = entry.entries?.[preferredShop] ? preferredShop : (entry.entries?.Tesco ? 'Tesco' : null);
        if (!targetShop) return;
        const candidate = { shop: targetShop, ...entry.entries[targetShop], score };
        if (
            !best ||
            score > best.score ||
            (score === best.score && candidate.itemName.localeCompare(best.itemName) < 0)
        ) {
            best = candidate;
        }
    });
    return best;
}

console.log('✅ Ingredient keyword map loaded');
