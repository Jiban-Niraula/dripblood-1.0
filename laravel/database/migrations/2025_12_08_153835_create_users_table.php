<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Public UID
            $table->uuid('uid')->unique();

            // Basic Info
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password')->nullable();

            $table->string('phone')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();

            // Address
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('country')->nullable();

            // Medical Info
            $table->string('blood_type')->nullable();
            $table->text('medical_conditions')->nullable();
            $table->text('notes')->nullable();

            // Profile
            $table->text('profile_image')->nullable();

            // User classification
            $table->enum('type', ['general', 'admin'])
                  ->default('general');

            $table->string('role')->default('user'); 
            // user, admin, staff

            $table->enum('status', ['active', 'inactive', 'blocked'])
                  ->default('active');

            // NEW FIELD ADDED
            $table->string('created_via')->default('system');
            // examples: system, admin, seed, api

            // Audit
            $table->unsignedBigInteger('created_by')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};