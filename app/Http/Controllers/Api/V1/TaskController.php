<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class TaskController extends Controller
{
    use ApiResponses;

    /**
     * Display a listing of the resource.
     */
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection|JsonResponse
    {
        try {
            $tasks = Task::latest()->paginate(5);

            return $this->successResponse(
                TaskResource::collection($tasks),
                ['toastMessage' => 'Your tasks have been successfully loaded!']
            );
        } catch (Throwable $e) {
            Log::error('Error fetching tasks:', ['error' => $e->getMessage()]);

            return $this->errorResponse("We couldn't load your tasks at this time. Please try again or contact support if the problem persists.");
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request): TaskResource|JsonResponse
    {
        $validated = $request->validated();

        try {
            $task = Task::create($validated);

            return $this->successResponse(
                new TaskResource($task),
                ['toastMessage' => 'A new task has been created successfully!'],
                Response::HTTP_CREATED
            );
        } catch (Throwable $e) {
            Log::error('Error creating task:', ['error' => $e->getMessage()]);

            return $this->errorResponse('Something went wrong while creating your task. Please try again or reach out for help.');
        }
    }

    /**
     * Update the specified resource in storage.
     * Example: toggling a task's completion state.
     */
    public function update(Request $request, Task $task): TaskResource|JsonResponse
    {
        try {
            $task->completed = ! $task->completed;
            $task->save();

            return $this->successResponse(
                new TaskResource($task),
                ['toastMessage' => $task->completed ? 'Great! Task completed.' : 'Task marked incomplete.']
            );
        } catch (Throwable $e) {
            Log::error('Error updating task:', ['error' => $e->getMessage()]);

            return $this->errorResponse('Oops! We couldn’t update the task.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task): JsonResponse
    {
        try {
            $id = $task->id;
            $task->delete();

            return $this->successResponse(
                ['id' => $id],
                ['toastMessage' => 'Task has been removed from your list.']
            );
        } catch (Throwable $e) {
            Log::error('Error deleting task:', ['error' => $e->getMessage()]);

            return $this->errorResponse('Something went wrong while removing the task.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
