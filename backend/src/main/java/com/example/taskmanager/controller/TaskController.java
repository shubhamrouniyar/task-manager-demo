package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> listTasks() {
        return taskService.findAll();
    }

    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id) {
        return taskService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@RequestBody Map<String, Object> body) {
        Object title = body.get("title");
        return taskService.create(title == null ? null : title.toString());
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String title = body.containsKey("title") && body.get("title") != null
                ? body.get("title").toString()
                : null;
        Boolean completed = null;
        if (body.containsKey("completed") && body.get("completed") != null) {
            completed = Boolean.valueOf(body.get("completed").toString());
        }
        return taskService.update(id, title, completed);
    }

    @PatchMapping("/{id}/toggle")
    public Task toggleTask(@PathVariable Long id) {
        return taskService.toggleCompleted(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {
        taskService.delete(id);
    }
}
