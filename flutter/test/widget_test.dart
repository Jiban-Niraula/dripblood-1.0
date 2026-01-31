import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dripblood/main.dart'; // <- make sure this import points to your main.dart

void main() {
  testWidgets('App launches', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const DripBloodApp());

    // Verify that DripBlood text shows up
    expect(find.text('DripBlood'), findsWidgets);
  });
}
