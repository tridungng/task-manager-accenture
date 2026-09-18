package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.HtmlUtils;

import java.net.URI;
import java.util.List;

/**
 * REST controller for task management operations.
 * Exposes endpoints for creating, reading, updating, and deleting tasks.
 * Includes XSS protection by escaping HTML in input fields.
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost"
})
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Retrieves all tasks.
     *
     * @return List of all tasks
     */
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    /**
     * Retrieves a specific task by its ID.
     *
     * @param id The ID of the task to retrieve (must not be null)
     * @return ResponseEntity containing the task if found, or 404 Not Found if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    /**
     * Creates a new task.
     *
     * @param task The task to create (with validation and XSS protection). The task ID will be ignored.
     * @return ResponseEntity containing the created task with generated ID and location header (HTTP 201 Created)
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        // Escape HTML to prevent XSS
        String escapedTitle = HtmlUtils.htmlEscape(task.getTitle());
        String escapedDescription = task.getDescription() != null ? HtmlUtils.htmlEscape(task.getDescription()) : null;
        task.setTitle(escapedTitle);
        task.setDescription(escapedDescription);
        Task savedTask = taskService.createTask(task);

        return ResponseEntity
                .created(URI.create("/api/tasks/" + savedTask.getId()))
                .body(savedTask);
    }

    /**
     * Updates an existing task.
     *
     * @param id          The ID of the task to update (must not be null)
     * @param taskDetails The updated task data (with validation and XSS protection). The task ID in the body is ignored.
     * @return ResponseEntity containing the updated task if found, or 404 Not Found if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task taskDetails) {
        // Escape HTML to prevent XSS
        String escapedTitle = HtmlUtils.htmlEscape(taskDetails.getTitle());
        String escapedDescription = taskDetails.getDescription() != null ? HtmlUtils.htmlEscape(taskDetails.getDescription()) : null;
        taskDetails.setTitle(escapedTitle);
        taskDetails.setDescription(escapedDescription);
        Task updatedTask = taskService.updateTask(id, taskDetails);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * Deletes a task by its ID.
     *
     * @param id The ID of the task to delete (must not be null)
     * @return ResponseEntity with HTTP 204 No Content if deletion was successful, or 404 Not Found if task not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}