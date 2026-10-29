import express from "express"
import taskModel from "../../model/Tasks.js"
const router = express.Router()

// CREATE TASKS

router.post("/create-tasks", async (req, res) => {
    try {
        let { task } = req.body
        let newtask = await taskModel.create({ task:task, 
            user:req.user.id })

        res.status(201).json({ msg: "Task Created successfully", newtask})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: "Internal Server Error" })
    }
})

// GET ALL TASKS
router.get("/get-tasks", async (req, res) => {
    try {
        let allTasks = await taskModel.find({
            user:req.user.id
    })

        res.status(200).json({ msg: "All tasks fetchd successfully",allTasks:allTasks })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: "Internal Server Error" })
    }
})


//UPDATE TASKS
router.patch("/update-task/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let changes = req.body

        let updatedTask = await taskModel.findByIdAndUpdate(id, { $set: changes }, { returnDocument: "after" })

        if (!updatedTask) {
            return res.status(404).json({ msg: "Task marked as completed" })
        }
        res.status(200).json({ msg: "Task Updated Successfully" })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: "Internal Server Error" })
    }
})


// DELETE TASKS

router.delete("/delete-task/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let deletedTask = await taskModel.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({
                msg: "Task Not Found"
            });
        }

        res.status(200).json({
            deletedTask,
            msg: "Task Deleted Successfully"
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});


export default router