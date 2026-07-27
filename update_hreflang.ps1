$pages = Get-ChildItem -Path "app" -Filter "page.tsx" -Recurse

foreach ($page in $pages) {
    $content = Get-Content -Path $page.FullName -Raw
    
    # Check if languages is already defined
    if ($content -match 'languages:\s*\{') {
        continue
    }

    # Extract the canonical URL to determine the base path
    if ($content -match 'canonical:\s*"(https://www.magentalabblog.com/?([^"]*))"') {
        $canonicalUrl = $matches[1]
        $path = $matches[2]
        
        # Determine the base path without language prefix
        $basePath = $path -replace '^en/?', '' -replace '^ja/?', ''
        $basePath = $basePath.Trim('/')
        
        $koUrl = if ($basePath) { "https://www.magentalabblog.com/$basePath" } else { "https://www.magentalabblog.com/" }
        $enUrl = if ($basePath) { "https://www.magentalabblog.com/en/$basePath" } else { "https://www.magentalabblog.com/en/" }
        $jaUrl = if ($basePath) { "https://www.magentalabblog.com/ja/$basePath" } else { "https://www.magentalabblog.com/ja/" }

        $languagesBlock = "`r`n    languages: {`r`n      'ko-KR': '$koUrl',`r`n      'en-US': '$enUrl',`r`n      'ja-JP': '$jaUrl',`r`n    },"
        
        # Inject languages block after canonical
        $newContent = $content -replace '(canonical:\s*"[^"]*",?)', "`$1$languagesBlock"
        
        if ($newContent -ne $content) {
            Set-Content -Path $page.FullName -Value $newContent -Encoding UTF8
            Write-Host "Updated $($page.FullName)"
        }
    }
}
