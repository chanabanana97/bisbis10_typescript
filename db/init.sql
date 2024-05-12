CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    averageRating NUMERIC(4,2),
    isKosher BOOLEAN,
    cuisines TEXT[]
);

CREATE TABLE IF NOT EXISTS dishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    UNIQUE (name, description, price)
);

CREATE TABLE IF NOT EXISTS restaurant_dishes (
    restaurantId INT,
    dishId INT,
    PRIMARY KEY (restaurantId, dishId),
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (dishId) REFERENCES dishes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ratings (
    restaurantId INT,
    rating NUMERIC(4,2),
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE

)