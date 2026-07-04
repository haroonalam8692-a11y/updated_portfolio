Add-Type -AssemblyName System.Drawing

function Compress-Image {
    param(
        [string]$sourcePath,
        [string]$outputPath,
        [int]$maxWidth,
        [int]$quality
    )

    try {
        $img = [System.Drawing.Image]::FromFile($sourcePath)
        $width = $img.Width
        $height = $img.Height

        # Calculate new dimensions if it exceeds maxWidth
        if ($width -gt $maxWidth) {
            $ratio = $maxWidth / $width
            $newWidth = $maxWidth
            $newHeight = [int]($height * $ratio)
        } else {
            $newWidth = $width
            $newHeight = $height
        }

        # Create bitmap and draw original image onto it
        $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graph = [System.Drawing.Graphics]::FromImage($bmp)
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.DrawImage($img, 0, 0, $newWidth, $newHeight)

        # Set JPEG quality encoder parameters
        $encoder = [System.Drawing.Imaging.Encoder]::Quality
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, $quality)

        # Get JPEG codec info
        $codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
        $jpegCodec = $codecs | Where-Object { $_.FormatDescription -eq "JPEG" }

        # Save to output
        $bmp.Save($outputPath, $jpegCodec, $encoderParams)

        # Clean up
        $graph.Dispose()
        $bmp.Dispose()
        $img.Dispose()

        Write-Host "Compressed $sourcePath -> $outputPath"
    } catch {
        Write-Error "Error compressing $sourcePath"
    }
}

# Create compressed assets folder if not exists
$compressedFolder = "assets_compressed"
if (!(Test-Path $compressedFolder)) {
    New-Item -ItemType Directory -Path $compressedFolder | Out-Null
}

# Compress the profile picture (max width 800px, 85% quality)
Compress-Image "assets/profile.png" "$compressedFolder/profile.jpg" 800 85

# Compress project images (max width 1000px, 80% quality)
Compress-Image "assets/project_uiux_1.png" "$compressedFolder/project_uiux_1.jpg" 1000 80
Compress-Image "assets/project_uiux_2.png" "$compressedFolder/project_uiux_2.jpg" 1000 80
Compress-Image "assets/project_uiux_3.png" "$compressedFolder/project_uiux_3.jpg" 1000 80
Compress-Image "assets/project_graphic_1.jpg" "$compressedFolder/project_graphic_1.jpg" 1000 80
Compress-Image "assets/project_graphic_2.jpg" "$compressedFolder/project_graphic_2.jpg" 1000 80
Compress-Image "assets/project_graphic_3.jpg" "$compressedFolder/project_graphic_3.jpg" 1000 80
