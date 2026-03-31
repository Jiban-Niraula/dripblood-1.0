<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donation_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('blood_donation_event_id')->constrained('blood_donation_events')->onDelete('cascade');
            $table->timestamp('registered_at');
            $table->enum('status', ['registered', 'donated', 'cancelled'])->default('registered');
            $table->datetime('donation_time')->nullable();
            $table->string('blood_type_donated')->nullable();
            $table->decimal('units_donated', 3, 1)->nullable();
            $table->text('notes')->nullable();
            $table->text('result')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'blood_donation_event_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_registrations');
    }
};
