<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('blood_donation_events', function (Blueprint $table) {
            $table->id();
            $table->string('camp_code')->unique();
            $table->string('camp_name');
            $table->string('organized_by');
            $table->string('supporting_hospital');
            $table->string('location');
            $table->enum('camp_type', ['single', 'multiple']);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->time('start_time');
            $table->time('end_time');
            $table->string('coordinator_name');
            $table->string('coordinator_contact');
            $table->string('coordinator_email')->nullable();
            $table->integer('expected_donors')->nullable();
            $table->integer('actual_donors')->default(0);
            $table->text('description')->nullable();
            $table->enum('status', ['Scheduled','In Progress','Completed','Cancelled'])->default('Scheduled');

            // Audit
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blood_donation_events');
    }
};
