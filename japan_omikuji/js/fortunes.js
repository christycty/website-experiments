/**
 * Fortune Data and Selection Logic
 * Traditional Japanese Omikuji System
 */

const FortuneSystem = {
    // Fortune levels with Japanese and English names
    levels: [
        {
            id: 'daikichi',
            japanese: '大吉',
            english: 'Great Fortune',
            weight: 15 // probability weight
        },
        {
            id: 'kichi',
            japanese: '吉',
            english: 'Good Fortune',
            weight: 25
        },
        {
            id: 'chukichi',
            japanese: '中吉',
            english: 'Middle Fortune',
            weight: 20
        },
        {
            id: 'shokichi',
            japanese: '小吉',
            english: 'Small Fortune',
            weight: 20
        },
        {
            id: 'suekichi',
            japanese: '末吉',
            english: 'Future Fortune',
            weight: 15
        },
        {
            id: 'kyo',
            japanese: '凶',
            english: 'Bad Fortune',
            weight: 5 // Less common, as is traditional
        }
    ],

    // Fortune messages for each category and level
    messages: {
        wishes: {
            daikichi: 'Your wishes will come true beyond your expectations. The time is right for new beginnings.',
            kichi: 'Your sincere wishes will be granted. Be patient and persistent.',
            chukichi: 'Your wishes will be fulfilled with steady effort. Keep faith.',
            shokichi: 'Small wishes will come true. Focus on what matters most.',
            suekichi: 'Your wishes will be realized in time. Wait for the right moment.',
            kyo: 'Be cautious with your wishes. Reflect on what you truly desire.'
        },
        love: {
            daikichi: 'A wonderful encounter awaits. Your heart will be filled with joy.',
            kichi: 'Love is blossoming. Nurture your relationships with care.',
            chukichi: 'Steady progress in matters of the heart. Communication is key.',
            shokichi: 'Small gestures of affection will strengthen bonds.',
            suekichi: 'Love will grow slowly but surely. Be patient.',
            kyo: 'Challenges in relationships. Work on understanding and compromise.'
        },
        health: {
            daikichi: 'Excellent health and vitality. Your energy is at its peak.',
            kichi: 'Good health continues. Maintain your positive habits.',
            chukichi: 'Generally healthy. Pay attention to rest and balance.',
            shokichi: 'Minor concerns may arise. Take preventive care.',
            suekichi: 'Health improves gradually. Be mindful of your body.',
            kyo: 'Take extra care of your health. Rest and recuperation are needed.'
        },
        business: {
            daikichi: 'Great success in your endeavors. Opportunities abound.',
            kichi: 'Your hard work will be recognized. Progress is steady.',
            chukichi: 'Moderate success. Keep working diligently.',
            shokichi: 'Small achievements lead to bigger things. Stay focused.',
            suekichi: 'Success comes later. Prepare and wait for the right time.',
            kyo: 'Difficulties in work. Seek advice and avoid hasty decisions.'
        },
        studies: {
            daikichi: 'Outstanding results in learning. Your mind is sharp and receptive.',
            kichi: 'Good progress in studies. Your efforts will pay off.',
            chukichi: 'Steady advancement in knowledge. Keep studying consistently.',
            shokichi: 'Small steps forward. Focus on fundamentals.',
            suekichi: 'Learning takes time. Be patient with yourself.',
            kyo: 'Challenges in studies. Seek help and change your approach.'
        },
        travel: {
            daikichi: 'Excellent time for travel. Adventures and discoveries await.',
            kichi: 'Good journeys ahead. Travel will bring joy and insight.',
            chukichi: 'Travel is favorable. Plan carefully for best results.',
            shokichi: 'Short trips are beneficial. Enjoy nearby destinations.',
            suekichi: 'Delay major travel. Better opportunities will come.',
            kyo: 'Avoid unnecessary travel. Stay close to home for now.'
        }
    },

    /**
     * Select a random fortune level based on weighted probabilities
     * @returns {Object} Selected fortune level
     */
    selectFortuneLevel() {
        const totalWeight = this.levels.reduce((sum, level) => sum + level.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let level of this.levels) {
            random -= level.weight;
            if (random <= 0) {
                return level;
            }
        }
        
        // Fallback (should never reach here)
        return this.levels[1]; // Return 'kichi' as default
    },

    /**
     * Generate a complete fortune with all categories
     * @returns {Object} Complete fortune object
     */
    generateFortune() {
        const level = this.selectFortuneLevel();
        
        return {
            level: {
                id: level.id,
                japanese: level.japanese,
                english: level.english
            },
            categories: {
                wishes: this.messages.wishes[level.id],
                love: this.messages.love[level.id],
                health: this.messages.health[level.id],
                business: this.messages.business[level.id],
                studies: this.messages.studies[level.id],
                travel: this.messages.travel[level.id]
            },
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Get fortune level color for styling
     * @param {string} levelId - Fortune level ID
     * @returns {string} Color code
     */
    getLevelColor(levelId) {
        const colors = {
            daikichi: '#CC0000',  // Shrine red
            kichi: '#D4AF37',     // Gold
            chukichi: '#FF6B6B',  // Light red
            shokichi: '#FFA500',  // Orange
            suekichi: '#4A90E2',  // Blue
            kyo: '#666666'        // Gray
        };
        return colors[levelId] || '#000000';
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FortuneSystem;
}

