<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponses
{
    /**
     * Return a success JSON response.
     */
    protected function successResponse(mixed $data = null, array $meta = [], int $status = Response::HTTP_OK): JsonResponse
    {
        if ($data instanceof AnonymousResourceCollection) {
            $data->additional(['meta' => array_merge(
                $data->additional['meta'] ?? [],
                $meta
            )]);

            return $data->response()->setStatusCode($status);
        }

        return response()->json([
            'data' => $data,
            'meta' => $meta,
        ], $status);
    }

    /**
     * Return an error JSON response.
     */
    protected function errorResponse(string $message = 'An error occurred.', int $status = Response::HTTP_BAD_REQUEST, mixed $data = null): JsonResponse
    {
        return response()->json([
            'data' => $data,
            'meta' => [
                'toastMessage' => $message,
            ],
        ], $status);
    }
}
