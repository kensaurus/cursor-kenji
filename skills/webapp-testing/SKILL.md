---
name: webapp-testing
description: Test local web applications using Playwright automation. Use when testing frontend functionality, debugging UI behavior, capturing screenshots, browser automation, or when user mentions "test UI", "Playwright", "e2e test", "browser test", "screenshot", "automate browser", or "verify functionality".
---

# Web Application Testing

To test local web applications, write native Python Playwright scripts.

**Helper Scripts Available**:
- `scripts/with_server.py` - Manages server lifecycle (supports multiple servers)

**Always run scripts with `--help` first** to see usage.

## CRITICAL: Check Existing First

**Before writing ANY test scripts, verify:**

1. **Check for existing test setup:**
```bash
ls -la tests/ __tests__/ e2e/ playwright/ cypress/ 2>/dev/null
cat package.json | grep -i "playwright\|cypress\|vitest\|jest"
cat playwright.config.* vitest.config.* 2>/dev/null
```

2. **Check for existing test utilities:**
```bash
ls -la scripts/*.py tests/utils/ tests/fixtures/ 2>/dev/null
rg "test-utils|renderWithProviders|mockServer" --type ts
```

3. **Check existing test patterns:**
```bash
rg "describe\(|it\(|test\(" --type ts -l | head -5
```

4. **Check for dev server config:**
```bash
cat package.json | grep -A2 "\"dev\"\|\"start\""
```

**Why:** Use existing test infrastructure. Don't create duplicate utilities.

## Decision Tree: Choosing Your Approach

```
User task → Is it static HTML?
    ├─ Yes → Read HTML file directly to identify selectors
    │         ├─ Success → Write Playwright script using selectors
    │         └─ Fails/Incomplete → Treat as dynamic (below)
    │
    └─ No (dynamic webapp) → Is the server already running?
        ├─ No → Run: python scripts/with_server.py --help
        │        Then use the helper + write simplified Playwright script
        │
        └─ Yes → Reconnaissance-then-action:
            1. Navigate and wait for networkidle
            2. Take screenshot or inspect DOM
            3. Identify selectors from rendered state
            4. Execute actions with discovered selectors
```

## Example: Using with_server.py

To start a server, run `--help` first, then use the helper:

**Single server:**
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

**Multiple servers (e.g., backend + frontend):**
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

To create an automation script, include only Playwright logic (servers are managed automatically):
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True) # Always launch chromium in headless mode
    page = browser.new_page()
    page.goto('http://localhost:5173') # Server already running and ready
    page.wait_for_load_state('networkidle') # CRITICAL: Wait for JS to execute
    # ... your automation logic
    browser.close()
```

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM**:
   ```python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   ```

2. **Identify selectors** from inspection results

3. **Execute actions** using discovered selectors

## Common Pitfall

❌ **Don't** inspect the DOM before waiting for `networkidle` on dynamic apps
✅ **Do** wait for `page.wait_for_load_state('networkidle')` before inspection

## Best Practices

- **Use bundled scripts as black boxes** - To accomplish a task, consider whether one of the scripts available in `scripts/` can help.
- Use `sync_playwright()` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: `text=`, `role=`, CSS selectors, or IDs
- Add appropriate waits: `page.wait_for_selector()` or `page.wait_for_timeout()`

## Common Playwright Patterns

### Taking Screenshots
```python
# Full page screenshot
page.screenshot(path='screenshot.png', full_page=True)

# Element screenshot
page.locator('.my-element').screenshot(path='element.png')

# Specific viewport
page.set_viewport_size({'width': 1920, 'height': 1080})
page.screenshot(path='desktop.png')
```

### Form Interactions
```python
# Fill form fields
page.fill('input[name="email"]', 'test@example.com')
page.fill('input[name="password"]', 'secret123')

# Select dropdown
page.select_option('select#country', 'japan')

# Check/uncheck
page.check('input[type="checkbox"]')
page.uncheck('input[type="checkbox"]')

# Click submit
page.click('button[type="submit"]')
```

### Waiting Strategies
```python
# Wait for element
page.wait_for_selector('.loaded-content')

# Wait for specific text
page.wait_for_selector('text=Success')

# Wait for network idle
page.wait_for_load_state('networkidle')

# Wait for navigation
with page.expect_navigation():
    page.click('a.nav-link')

# Custom timeout
page.wait_for_selector('.slow-element', timeout=10000)
```

### Console Log Capture
```python
# Capture console logs
page.on('console', lambda msg: print(f'Console {msg.type}: {msg.text}'))

# Capture errors
page.on('pageerror', lambda exc: print(f'Error: {exc}'))
```

### Network Interception
```python
# Block images for faster testing
page.route('**/*.{png,jpg,jpeg,gif}', lambda route: route.abort())

# Mock API responses
page.route('**/api/users', lambda route: route.fulfill(
    status=200,
    content_type='application/json',
    body='[{"id": 1, "name": "Test User"}]'
))
```

## Test Structure Template

```python
from playwright.sync_api import sync_playwright
import sys

def test_feature():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            # Setup
            page.goto('http://localhost:3000')
            page.wait_for_load_state('networkidle')
            
            # Test actions
            page.click('button#start')
            page.fill('input#name', 'Test')
            page.click('button#submit')
            
            # Assertions
            assert page.locator('text=Success').is_visible()
            
            # Screenshot on success
            page.screenshot(path='/tmp/test-passed.png')
            print('✅ Test passed!')
            
        except Exception as e:
            # Screenshot on failure
            page.screenshot(path='/tmp/test-failed.png')
            print(f'❌ Test failed: {e}')
            sys.exit(1)
            
        finally:
            browser.close()

if __name__ == '__main__':
    test_feature()
```
