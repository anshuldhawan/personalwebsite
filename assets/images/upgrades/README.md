# Website image refresh

Generated with the built-in `image_gen` tool on September 29, 2026. The tool selects its model automatically and does not expose the underlying model version.

`prompts.json` records the complete prompts. `review.json` records the review of all 46 original raster image files and their SHA-256 checksums.

The four externally hosted company logos (Meta, Zynga, EA, and VRChat) are brand assets and remain unchanged as well.

## Scope

- Regenerate the 25 original AI editorial illustrations and the two Network Cities concept-art images explicitly identified as GPT Image output in the case study.
- Preserve the RozziRoomian artwork and its credit, the award photograph, video frames and posters, and the rendered 3D game assets.
- Preserve images whose image-model provenance cannot be established, including the game architecture diagram, the source seed still, the existing Words with Degens poster, and the mascot sprite sheet.

The original image files remain unchanged. The website uses replacement files from this directory; reverting the references restores the old visuals.

Full-size replacements use WebP quality 85. Eight 480-pixel cover thumbnails use WebP quality 82, totaling approximately 291 KB for the homepage. Full-size replacements total approximately 8.16 MB across ten article/project pages.

Validation: all 27 replacements loaded successfully across the ten affected pages at a 390-pixel mobile viewport, with no horizontal overflow or browser errors. Homepage cards were also checked at desktop and mobile sizes. All 46 original local image checksums and all four external logo references were preserved.

Network Cities replacements are refreshed concept-art illustrations, not new gameplay screenshots or changes to the shipped game.
