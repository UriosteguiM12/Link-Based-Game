class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

        if (key === "Exit") {
            const walkieData = this.engine.storyData.Locations["Walkies"];
            const managerData = this.engine.storyData.Locations["Manager"];
    
            const hasTrueKey = walkieData && walkieData.TrueKey;
            const hasFakeKey = managerData && managerData.FakeKey;
    
            if (hasTrueKey) {
                this.engine.show(locationData.Body3); // Escaped successfully
                if (locationData.Escape) {
                    for (let choice of locationData.Escape) {
                        this.engine.addChoice(choice.Text, choice);
                    }
                } else {
                    this.engine.addChoice("The end.");
                }
            } else if (hasFakeKey) {
                this.engine.show(locationData.Body2); // Tried wrong key
                this.engine.addChoice("[ Go to the cashier area ]", { Text: "[ Go to the cashier area ]", Target: "Walkies" });
            } else {
                this.engine.show(locationData.Body); // No key yet
                locationData.Flag = true;
                this.engine.addChoice("[ Go to the dining area ]", { Text: "[ Go to the dining area ]", Target: "Dining" });
            }
    
            return;
        }
    
        if (locationData.Flag) {
            this.engine.show(locationData.Body2);
        } else {
            this.engine.show(locationData.Body);
            locationData.Flag = true;
        }
    
        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);
            let nextLocationKey = choice.Target;
    
            if (nextLocationKey === "Walkies") {
                this.engine.gotoScene(Walkies, nextLocationKey);
            } else {
                this.engine.gotoScene(Location, nextLocationKey);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}
    

class Walkies extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

        // Show the correct body text based on key obtained
        if (locationData.TrueKey) {
            this.engine.show(locationData.Body3);
        } else if (locationData.Flag) {
            this.engine.show(locationData.Body2);
        } else {
            this.engine.show(locationData.Body);
            locationData.Flag = true;
        }

        // Show choices
        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice && choice.Text === "[ Channel 3 ]") {
            this.engine.storyData.Locations["Walkies"].TrueKey = true; // Save that the player now has the key
        }

        super.handleChoice(choice);
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');