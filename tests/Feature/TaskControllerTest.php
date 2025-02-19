<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_fetch_a_list_of_tasks()
    {
        Task::factory()->count(10)->create();

        $response = $this->getJson('/api/tasks');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'content', 'completed']],
                'meta' => ['toastMessage'],
            ])
            ->assertJsonPath('meta.toastMessage', 'Your tasks have been successfully loaded!');
    }

    #[Test]
    public function it_can_create_a_new_task()
    {
        $data = ['content' => 'Write tests'];

        $response = $this->postJson('/api/tasks', $data);

        $response->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'content'], 'meta'])
            ->assertJsonPath('meta.toastMessage', 'A new task has been created successfully!');

        $this->assertDatabaseHas('tasks', $data);
    }

    #[Test]
    public function it_validates_task_creation()
    {
        $response = $this->postJson('/api/tasks', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['content']);
    }

    #[Test]
    public function it_can_toggle_task_completion()
    {
        $task = Task::factory()->create(['completed' => false]);

        $response = $this->patchJson("/api/tasks/{$task->id}");

        $response->assertOk()
            ->assertJsonPath('data.completed', true)
            ->assertJsonPath('meta.toastMessage', 'Great! Task completed.');

        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'completed' => true]);

        $response = $this->patchJson("/api/tasks/{$task->id}");

        $response->assertOk()
            ->assertJsonPath('data.completed', false)
            ->assertJsonPath('meta.toastMessage', 'Task marked incomplete.');
    }

    #[Test]
    public function it_can_delete_a_task()
    {
        $task = Task::factory()->create();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $task->id)
            ->assertJsonPath('meta.toastMessage', 'Task has been removed from your list.');

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    #[Test]
    public function it_handles_deleting_a_nonexistent_task()
    {
        $response = $this->deleteJson('/api/tasks/999');

        $response->assertNotFound();
    }

    #[Test]
    public function it_returns_pagination_data()
    {
        Task::factory()->count(15)->create();

        $response = $this->getJson('/api/tasks');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'content', 'completed']],
                'links' => ['first', 'last', 'prev', 'next'],
                'meta' => ['current_page', 'last_page', 'total'],
            ]);
    }
}
