package com.example.taskmanager.service;

import com.example.taskmanager.model.Task;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TaskService {

    private final Map<Long, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicLong idSequence = new AtomicLong(1);

    public List<Task> findAll() {
        return new ArrayList<>(tasks.values());
    }

    public Task findById(Long id) {
        Task task = tasks.get(id);
        if (task == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found: " + id);
        }
        return task;
    }

    public Task create(String title) {
        if (title == null || title.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
        Long id = idSequence.getAndIncrement();
        Task task = new Task(id, title.trim(), false, Instant.now());
        tasks.put(id, task);
        return task;
    }

    public Task update(Long id, String title, Boolean completed) {
        Task existing = findById(id);
        if (title != null) {
            if (title.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title cannot be blank");
            }
            existing.setTitle(title.trim());
        }
        if (completed != null) {
            existing.setCompleted(completed);
        }
        return existing;
    }

    public Task toggleCompleted(Long id) {
        Task existing = findById(id);
        existing.setCompleted(!existing.isCompleted());
        return existing;
    }

    public void delete(Long id) {
        if (tasks.remove(id) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found: " + id);
        }
    }
}
