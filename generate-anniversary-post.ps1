$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$logoPath = Join-Path $root "assets\logo.jpg"
$outputDir = Join-Path $root "output"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$nLower = [char]0x00F1
$nUpper = [char]0x00D1
$aAccent = [char]0x00E1
$iAccent = [char]0x00ED
$oAccent = [char]0x00F3

$headline = "Felicitaciones"
$subhead = "POR UN A$($nUpper)O M$($aAccent)S DE CREACI$($oAccent)N"
$letterTitle = "Mensaje de nuestro CEO"
$body = @"
Hoy celebramos con orgullo un a$($nLower)o m$($aAccent)s de historia, trabajo y crecimiento.

En nombre de nuestra empresa, extendemos nuestras m$($aAccent)s sinceras felicitaciones a cada persona que ha sido parte de este camino. Cada logro alcanzado refleja compromiso, visi$($oAccent)n y confianza en lo que construimos d$($iAccent)a a d$($iAccent)a.

Que este nuevo aniversario nos inspire a seguir avanzando con excelencia, innovaci$($oAccent)n y unidad, manteniendo firme el prop$($oAccent)sito que dio origen a nuestra compa$($nLower)$($iAccent)a.

Con aprecio y gratitud,
"@
$signature = "CEO"
$footer = "Gracias por ser parte de nuestra historia"

function New-RoundedPath {
    param([float]$X, [float]$Y, [float]$W, [float]$H, [float]$R)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $R * 2
    $path.AddArc($X, $Y, $d, $d, 180, 90)
    $path.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
    $path.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
    $path.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function Draw-WrappedText {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$Text,
        [System.Drawing.Font]$Font,
        [System.Drawing.Brush]$Brush,
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$LineHeight,
        [System.Drawing.StringFormat]$Format
    )

    $cursorY = $Y
    foreach ($paragraph in ($Text -split "(\r?\n){2,}")) {
        $paragraph = $paragraph.Trim()
        if ([string]::IsNullOrWhiteSpace($paragraph)) { continue }
        $line = ""
        foreach ($word in ($paragraph -split "\s+")) {
            $candidate = if ($line.Length -eq 0) { $word } else { "$line $word" }
            if ($Graphics.MeasureString($candidate, $Font).Width -le $Width) {
                $line = $candidate
            }
            else {
                $Graphics.DrawString($line, $Font, $Brush, [System.Drawing.RectangleF]::new($X, $cursorY, $Width, $LineHeight + 10), $Format)
                $cursorY += $LineHeight
                $line = $word
            }
        }
        if ($line.Length -gt 0) {
            $Graphics.DrawString($line, $Font, $Brush, [System.Drawing.RectangleF]::new($X, $cursorY, $Width, $LineHeight + 10), $Format)
            $cursorY += $LineHeight
        }
        $cursorY += $LineHeight * 0.42
    }
    return $cursorY
}

function Draw-LogoContained {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Image]$Logo,
        [float]$X,
        [float]$Y,
        [float]$BoxW,
        [float]$BoxH,
        [float]$Opacity
    )

    $ratio = [Math]::Min($BoxW / $Logo.Width, $BoxH / $Logo.Height)
    $w = $Logo.Width * $ratio
    $h = $Logo.Height * $ratio
    $dx = $X + (($BoxW - $w) / 2)
    $dy = $Y + (($BoxH - $h) / 2)

    $matrix = New-Object System.Drawing.Imaging.ColorMatrix
    $matrix.Matrix33 = $Opacity
    $attributes = New-Object System.Drawing.Imaging.ImageAttributes
    $attributes.SetColorMatrix($matrix, [System.Drawing.Imaging.ColorMatrixFlag]::Default, [System.Drawing.Imaging.ColorAdjustType]::Bitmap)
    $dest = [System.Drawing.Rectangle]::new([int]$dx, [int]$dy, [int]$w, [int]$h)
    $Graphics.DrawImage($Logo, $dest, 0, 0, $Logo.Width, $Logo.Height, [System.Drawing.GraphicsUnit]::Pixel, $attributes)
}

function New-Post {
    param([int]$Width, [int]$Height, [string]$OutputPath)

    $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $logo = [System.Drawing.Image]::FromFile($logoPath)

    try {
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

        $blue = [System.Drawing.Color]::FromArgb(0, 132, 214)
        $cyan = [System.Drawing.Color]::FromArgb(28, 205, 219)
        $ink = [System.Drawing.Color]::FromArgb(18, 48, 66)
        $muted = [System.Drawing.Color]::FromArgb(81, 111, 126)
        $line = [System.Drawing.Color]::FromArgb(184, 224, 238)

        $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            [System.Drawing.Rectangle]::new(0, 0, $Width, $Height),
            [System.Drawing.Color]::FromArgb(248, 252, 255),
            [System.Drawing.Color]::FromArgb(228, 244, 252),
            [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
        )
        $graphics.FillRectangle($bg, 0, 0, $Width, $Height)

        $accentBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            [System.Drawing.Rectangle]::new(0, 0, $Width, $Height),
            $cyan,
            $blue,
            [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal
        )
        $topBandHeight = [int]($Height * 0.17)
        $graphics.FillRectangle($accentBrush, 0, 0, $Width, $topBandHeight)
        $graphics.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(24, 255, 255, 255))), 0, $topBandHeight - 42, $Width, 42)

        Draw-LogoContained -Graphics $graphics -Logo $logo -X ($Width * 0.635) -Y ($Height * 0.045) -BoxW ($Width * 0.245) -BoxH ($Height * 0.105) -Opacity 1.0
        Draw-LogoContained -Graphics $graphics -Logo $logo -X ($Width * 0.08) -Y ($Height * 0.57) -BoxW ($Width * 0.84) -BoxH ($Height * 0.30) -Opacity 0.055

        $outerMargin = [int]($Width * 0.07)
        $cardX = $outerMargin
        $cardY = [int]($Height * 0.13)
        $cardW = $Width - ($outerMargin * 2)
        $cardH = [int]($Height * 0.72)

        $shadowPath = New-RoundedPath -X ($cardX + 10) -Y ($cardY + 14) -W $cardW -H $cardH -R 36
        $graphics.FillPath((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 0, 63, 92))), $shadowPath)
        $shadowPath.Dispose()
        $cardPath = New-RoundedPath -X $cardX -Y $cardY -W $cardW -H $cardH -R 36
        $graphics.FillPath((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 255, 255, 255))), $cardPath)
        $graphics.DrawPath((New-Object System.Drawing.Pen($line, 2)), $cardPath)
        $cardPath.Dispose()

        $contentX = $cardX + [int]($cardW * 0.075)
        $contentW = $cardW - [int]($cardW * 0.15)
        $currentY = $cardY + [int]($cardH * 0.085)

        $alignCenter = New-Object System.Drawing.StringFormat
        $alignCenter.Alignment = [System.Drawing.StringAlignment]::Center
        $alignNear = New-Object System.Drawing.StringFormat
        $alignNear.Alignment = [System.Drawing.StringAlignment]::Near
        $alignNear.LineAlignment = [System.Drawing.StringAlignment]::Near

        $headlineFont = New-Object System.Drawing.Font("Segoe UI Semibold", [float]($Width * 0.059), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $subheadFont = New-Object System.Drawing.Font("Segoe UI Semibold", [float]($Width * 0.021), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $titleFont = New-Object System.Drawing.Font("Segoe UI Semibold", [float]($Width * 0.032), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $bodyFont = New-Object System.Drawing.Font("Segoe UI", [float]($Width * 0.0255), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $signatureFont = New-Object System.Drawing.Font("Segoe UI Semibold", [float]($Width * 0.031), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $footerFont = New-Object System.Drawing.Font("Segoe UI", [float]($Width * 0.022), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

        $graphics.DrawString($headline, $headlineFont, (New-Object System.Drawing.SolidBrush($ink)), [System.Drawing.RectangleF]::new($contentX, $currentY, $contentW, 82), $alignCenter)
        $currentY += [int]($Width * 0.072)
        $graphics.DrawString($subhead, $subheadFont, (New-Object System.Drawing.SolidBrush($blue)), [System.Drawing.RectangleF]::new($contentX, $currentY, $contentW, 36), $alignCenter)
        $currentY += [int]($Width * 0.064)
        $ruleW = [int]($contentW * 0.22)
        $graphics.FillRectangle($accentBrush, [int]($contentX + (($contentW - $ruleW) / 2)), [int]$currentY, $ruleW, 5)
        $currentY += [int]($Width * 0.052)
        $graphics.DrawString($letterTitle, $titleFont, (New-Object System.Drawing.SolidBrush($ink)), [System.Drawing.RectangleF]::new($contentX, $currentY, $contentW, 48), $alignCenter)
        $currentY += [int]($Width * 0.06)

        $lineHeight = [float]($Width * 0.0385)
        $currentY = Draw-WrappedText -Graphics $graphics -Text $body -Font $bodyFont -Brush (New-Object System.Drawing.SolidBrush($muted)) -X $contentX -Y $currentY -Width $contentW -LineHeight $lineHeight -Format $alignNear

        $currentY += [int]($Width * 0.012)
        $graphics.DrawString($signature, $signatureFont, (New-Object System.Drawing.SolidBrush($ink)), [System.Drawing.RectangleF]::new($contentX, $currentY, $contentW, 45), $alignCenter)
        $currentY += [int]($Width * 0.043)
        $graphics.DrawString($footer, $footerFont, (New-Object System.Drawing.SolidBrush($blue)), [System.Drawing.RectangleF]::new($contentX, $currentY, $contentW, 42), $alignCenter)

        $bottomY = $cardY + $cardH + [int]($Height * 0.035)
        $graphics.DrawString("Aniversario empresarial", $footerFont, (New-Object System.Drawing.SolidBrush($muted)), [System.Drawing.RectangleF]::new($outerMargin, $bottomY, $Width - ($outerMargin * 2), 42), $alignCenter)

        $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        $logo.Dispose()
        $graphics.Dispose()
        $bitmap.Dispose()
    }
}

New-Post -Width 1080 -Height 1350 -OutputPath (Join-Path $outputDir "carta-felicitaciones-instagram-facebook.png")
New-Post -Width 1080 -Height 1920 -OutputPath (Join-Path $outputDir "carta-felicitaciones-tiktok.png")

Write-Host "Listo:"
Get-ChildItem $outputDir -Filter "carta-felicitaciones-*.png" | Select-Object FullName, Length
