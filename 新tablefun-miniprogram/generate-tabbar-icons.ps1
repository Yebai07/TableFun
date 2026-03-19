# 创建最小化的PNG图标用于微信小程序tabBar
# 这些图标非常小（67字节），符合40KB限制

$base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

$icons = @(
    "home.png",
    "home-active.png",
    "script.png",
    "script-active.png",
    "create.png",
    "create-active.png",
    "my.png",
    "my-active.png"
)

$outputDir = "C:\Users\夏雪\Desktop\tablefun-miniprogram\images"

foreach ($icon in $icons) {
    $filePath = Join-Path $outputDir $icon
    [System.IO.File]::WriteAllBytes($filePath, [System.Convert]::FromBase64String($base64Png))
    Write-Host "Created: $filePath"
}

Write-Host "All tabBar icons created successfully!"
