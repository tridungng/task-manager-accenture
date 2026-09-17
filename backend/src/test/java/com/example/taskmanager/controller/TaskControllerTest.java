package com.example.taskmanager.controller;

import com.example.taskmanager.TaskManagerApplication;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = TaskManagerApplication.class)
@AutoConfigureMockMvc
@Transactional
@Rollback
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        sampleTask = new Task();
        sampleTask.setTitle("Sample Task");
        sampleTask.setDescription("Sample Description");
        sampleTask.setStatus(TaskStatus.TODO);
        sampleTask.setDueDate(LocalDate.now().plusDays(1));
    }

    @Test
    void shouldReturnEmptyListWhenNoTasks() throws Exception {
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void shouldCreateAndRetrieveTask() throws Exception {
        // Create task
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleTask)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/api/tasks/")))
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is(sampleTask.getTitle())))
                .andExpect(jsonPath("$.description", is(sampleTask.getDescription())))
                .andExpect(jsonPath("$.status", is(sampleTask.getStatus().toString())))
                .andExpect(jsonPath("$.dueDate", is(sampleTask.getDueDate().toString())));

        // Get all tasks
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is(sampleTask.getTitle())));
    }

    @Test
    void shouldGetTaskById() throws Exception {
        // Create task
        Long taskId = objectMapper.readValue(
                mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleTask)))
                        .andExpect(status().isCreated())
                        .andReturn()
                        .getResponse()
                        .getContentAsString(), Task.class).getId();

        // Get task by id
        mockMvc.perform(get("/api/tasks/{id}", taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(taskId.intValue())))
                .andExpect(jsonPath("$.title", is(sampleTask.getTitle())));
    }

    @Test
    void shouldUpdateTask() throws Exception {
        // Create task
        Long taskId = objectMapper.readValue(
                mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleTask)))
                        .andExpect(status().isCreated())
                        .andReturn()
                        .getResponse()
                        .getContentAsString(), Task.class).getId();

        // Update task
        Task updatedTask = new Task();
        updatedTask.setTitle("Updated Title");
        updatedTask.setDescription("Updated Description");
        updatedTask.setStatus(TaskStatus.DONE);
        updatedTask.setDueDate(LocalDate.now().plusDays(2));

        mockMvc.perform(put("/api/tasks/{id}", taskId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedTask)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is(updatedTask.getTitle())))
                .andExpect(jsonPath("$.description", is(updatedTask.getDescription())))
                .andExpect(jsonPath("$.status", is(updatedTask.getStatus().toString())))
                .andExpect(jsonPath("$.dueDate", is(updatedTask.getDueDate().toString())));
    }

    @Test
    void shouldDeleteTask() throws Exception {
        // Create task
        Long taskId = objectMapper.readValue(
                mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleTask)))
                        .andExpect(status().isCreated())
                        .andReturn()
                        .getResponse()
                        .getContentAsString(), Task.class).getId();

        // Delete task
        mockMvc.perform(delete("/api/tasks/{id}", taskId))
                .andExpect(status().isNoContent());

        // Verify task is deleted
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void shouldReturn404WhenTaskNotFound() throws Exception {
        mockMvc.perform(get("/api/tasks/{id}", 999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Task not found with id: 999")));
    }

    @Test
    void shouldReturnValidationErrorWhenTitleIsBlank() throws Exception {
        Task task = new Task();
        task.setTitle("   "); // Blank title
        task.setDescription("Valid description");
        task.setStatus(TaskStatus.TODO);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title", is("must not be blank")));
    }

    @Test
    void shouldReturnValidationErrorWhenTitleTooLong() throws Exception {
        Task task = new Task();
        task.setTitle("a".repeat(101)); // 101 characters
        task.setDescription("Valid description");
        task.setStatus(TaskStatus.TODO);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title", is("size must be between 0 and 100")));
    }

    @Test
    void shouldReturnValidationErrorWhenDescriptionTooLong() throws Exception {
        Task task = new Task();
        task.setTitle("Valid title");
        task.setDescription("a".repeat(501)); // 501 characters
        task.setStatus(TaskStatus.TODO);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.description", is("size must be between 0 and 500")));
    }
}