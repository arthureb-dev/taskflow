# TaskFlow - Todo App

TaskFlow is a modern full-stack Todo application built with Laravel and Vue 3. It provides a seamless user experience with responsive design, dark mode, Tailwind CSS styling, Heroicons integration, and comprehensive API-driven task management. The application is fully tested with Vitest and PHPUnit.

## Demo

http://137.184.103.55/

## Features

### Frontend (Vue 3)

- **Dark Mode Toggle:** Easily switch between light and dark themes.
- **Task Management:**
    - Add, edit, mark complete/incomplete, and delete tasks.
    - Optimistic UI updates with toast notifications.
- **Tailwind CSS:** Clean, responsive design using utility-first CSS.
- **Heroicons Integration:** Use high-quality icons for actions (refresh, add, delete, etc.).
- **Reusable Components:** Includes a custom Spinner component with configurable classes.
- **Testing:** Comprehensive tests using Vitest and @vue/test-utils.

### Backend (Laravel)

- **RESTful API:** Endpoints for listing, creating, updating, and deleting tasks.
- **API Responses:** Consistent JSON responses with a toast message using an ApiResponses trait.
- **Eloquent Models & Factories:** Easy management and testing of tasks.
- **Validation:** Request validation through Form Request classes.
- **Pagination:** Built-in pagination for task listings.

### Testing

- **Laravel Tests:** PHPUnit tests for API endpoints.
- **Vue Component Tests:** Vitest tests for Vue components with mocked Axios and Heroicons.
- **Mocking:** Axios is mocked to simulate API responses.
- **Global Setup:** Uses Vitest’s configuration to set up the test environment.

## Installation

### Requirements

- PHP 8.0+
- Composer
- Node.js & Yarn (or npm)

## Setup Options

### Option 1: Web Assembly

1. Install WebAssembly Container:
    ```sh
    curl https://get.wasmer.io -sSfL | sh
    ```
2. Run Application:
    ```sh
    wasmer run arthureb-dev/taskflow
    ```
3. Access the application:
    ```sh
    http://localhost:8080
    ```

### Option 2: Laravel Sail

1. Download and install Docker: https://www.docker.com/
2. Clone the repository:
    ```sh
    git clone https://github.com/arthureb-dev/taskflow
    cd taskflow
    ```
3. Copy:
    ```sh
    cp .env.example .env
    ./vendor/bin/sail artisan key:generate
    ```
4. Start Sail and install dependencies:
    ```sh
    ./vendor/bin/sail up -d
    ./vendor/bin/sail composer install
    ./vendor/bin/sail yarn install
    ```
5. Run migrations:
    ```sh
     ./vendor/bin/sail artisan migrate --seed
    ```
6. Access the application:

```sh
 Laravel API: http://localhost:3003
 Vue development server: http://localhost:5173
```

### Option 3: Composer and Local Environment

1. Clone the repository: https://github.com/arthureb-dev/taskflow
    ```sh
    git clone https://github.com/yourusername/taskflow.git
    cd taskflow
    ```
2. Install PHP dependencies:
    ```sh
    composer install
    ```
3. Install Node.js dependencies:
    ```sh
    yarn install
    ```
4. Copy the environment file and generate the app key:
    ```sh
    cp .env.example .env
    php artisan key:generate
    ```
5. Run migrations:
    ```sh
    php artisan migrate --seed
    ```
6. Start the Laravel server:
    ```sh
    php artisan serve
    ```
7. Start the Vite development server:
    ```sh
    yarn run dev
    ```
8. Access the application:
    ```sh
    Laravel API: http://127.0.0.1:8000
    Vue development server: http://localhost:5173
    ```

## Testing

1. Laravel Tests
    ```sh
    php artisan test
    ```
2. Vue Component Tests (Vitest)
    ```sh
    yarn test
    ```
