import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

class AdSlider extends StatefulWidget {
  final List<String> adImages;

  const AdSlider({super.key, required this.adImages});

  @override
  State<AdSlider> createState() => _AdSliderState();
}

class _AdSliderState extends State<AdSlider> {
  int _currentAdIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CarouselSlider(
          items: widget.adImages
              .map((image) => ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: Image.asset(
              image,
              fit: BoxFit.cover,
              width: double.infinity,
            ),
          ))
              .toList(),
          options: CarouselOptions(
            height: 140,
            autoPlay: true,
            enlargeCenterPage: true,
            viewportFraction: 0.9,
            onPageChanged: (index, reason) {
              setState(() {
                _currentAdIndex = index;
              });
            },
          ),
        ),

        const SizedBox(height: 8),

        // Slider indicators
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: widget.adImages.asMap().entries.map((entry) {
            return Container(
              width: 8,
              height: 8,
              margin: const EdgeInsets.symmetric(horizontal: 4),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _currentAdIndex == entry.key
                    ? const Color(0xFFD32F2F)
                    : Colors.grey.shade400,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
