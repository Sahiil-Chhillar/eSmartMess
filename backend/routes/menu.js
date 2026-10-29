const express = require('express');
const { userAuth, isAdmin } = require('../middlewares/auth');
const Menu = require('../models/Menu');

const router = express.Router();

//  Add Menu (Admin only)
router.post('/add', userAuth, isAdmin, async (req, res) => {
    try {
        const { day, breakfast, lunch, dinner } = req.body;
        const newMenu = new Menu({ day, breakfast, lunch, dinner });
        await newMenu.save();

        res.status(201).json({ message: "Menu added successfully!", menu: newMenu });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Menu (Admin only)
router.put('/update/:day', userAuth, isAdmin, async (req, res) => {
    try {
        const day = req.params.day;

        const { breakfast, lunch, dinner } = req.body;
        const updatedMenu = await Menu.findOneAndUpdate(
            { day: day },
            { breakfast, lunch, dinner },
            { new: true }
        );

        if (!updatedMenu) {
            return res.status(404).json({ message: "Menu not found!" });
        }

        res.json({ message: "Menu updated successfully!", menu: updatedMenu });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//  Delete Menu (Admin only)
router.delete('/delete/:day', userAuth, isAdmin, async (req, res) => {
    try {
        const deletedMenu = await Menu.findOneAndDelete({ day: req.params.day });

        if (!deletedMenu) {
            return res.status(404).json({ message: "Menu not found!" });
        }

        res.json({ message: "Menu deleted successfully!", menu: deletedMenu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//  Get Menu (Public)
router.get('/get', async (req, res) => {
    try {
        const menu = await Menu.find();
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
