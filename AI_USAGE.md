# AI Usage

## Tool

Claude Code

## How AI Was Used

Claude Code was used throughout development for:

- initial architecture
- Spring Boot project structure
- REST API implementation
- React component generation
- validation
- error handling
- writing tests
- debugging
- refactoring
- documentation

## Example Prompts / Instructions

Examples of instructions given to Claude:

- Design a minimal architecture for a React + Spring Boot CRUD application.
- Implement REST endpoints for Task.
- Add Bean Validation for title and description.
- Add React form validation.
- Add backend integration tests.
- Review the project and remove unnecessary complexity.
- Debug frontend/backend API integration issues.

## Benefits

AI accelerated repetitive implementation tasks and helped produce a consistent project structure.

## Limitations

Generated code still required verification. Important areas that required human review included:

- validation behavior
- REST status codes
- frontend/backend field consistency
- update behavior
- error handling
- test coverage

## Critical Reflection

The agent was useful for quickly generating boilerplate and suggesting implementation approaches, but its output was
treated as a starting point rather than automatically accepted.

The implementation was reviewed for correctness, unnecessary complexity, consistency, and maintainability.

Using a minimal architecture made it easier to inspect and validate the generated code.