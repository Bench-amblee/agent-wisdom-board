# How to Enable Airia Orchestration

## Quick Start

You've created the 3 Airia agents! Now here's how to enable Airia orchestration:

### Step 1: Copy `.env.example` to `.env`

```bash
copy .env.example .env
```

### Step 2: Add Your API Keys to `.env`

Open `.env` and fill in your API keys:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your-actual-openai-key

# Linkup API Configuration
LINKUP_API_KEY=your-actual-linkup-key
LINKUP_BASE_URL=https://api.linkup.so/v1

# Airia API Configuration
AIRIA_API_KEY=your-actual-airia-key
AIRIA_BASE_URL=https://api.airia.ai/v2

# Airia Agent Pipeline IDs (already filled in with your agents!)
AIRIA_SALES_AGENT_ID=0fd0347f-27c2-4205-85ba-0d65934172b1
AIRIA_CS_AGENT_ID=7401dfba-ed4b-470c-bbb5-91bfe4e4be42
AIRIA_RESEARCH_AGENT_ID=0e4fde0c-1d36-47c6-bab5-e3c4e52ccae2

# Enable Airia orchestration - CHANGE THIS TO true
USE_AIRIA_ORCHESTRATION=true
```

### Step 3: Restart the Backend

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run fastapi
```

## That's It!

Now when you call `/api/advisory-board/discuss`, it will use your Airia agents instead of direct OpenAI calls!

---

## What Changes When Airia is Enabled?

### Before (Custom Orchestration):
```
User Question → FastAPI → Custom Orchestrator → OpenAI (15-20 calls) → Response
```

### After (Airia Orchestration):
```
User Question → FastAPI → Custom Orchestrator → Airia Pipelines → Response
```

**Key differences:**
- ✅ Agents run through your Airia pipelines
- ✅ Airia handles the agent execution
- ✅ You can monitor in Airia dashboard
- ✅ You can modify agent prompts in Airia without code changes
- ⚠️ Slightly different response format (depends on your Airia pipeline output)

---

## Testing Airia Integration

### 1. Check Health

```bash
curl http://localhost:8000/health
```

Should return `"status": "healthy"`

### 2. Test Single Agent (Direct Airia Call)

You can test calling your Airia pipeline directly:

```bash
curl -X POST https://api.airia.ai/v2/PipelineExecution/0fd0347f-27c2-4205-85ba-0d65934172b1 \
  -H "Authorization: Bearer YOUR_AIRIA_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is our current revenue?",
    "context": "Revenue: $2.45M"
  }'
```

### 3. Test Full Discussion (Through Your Backend)

```bash
curl -X POST http://localhost:8000/api/advisory-board/discuss \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How can we improve customer retention?",
    "include_research": true
  }'
```

This should now use Airia for all agent responses!

---

## Troubleshooting

### "Pipeline execution error"

**Issue**: Airia pipeline returns an error

**Solutions**:
1. Check your Airia API key is correct
2. Verify the pipeline IDs are correct
3. Check that your Airia agents accept `question` and `context` parameters
4. Look at the error message in the backend logs

### "Error executing agent"

**Issue**: Agent execution failed

**Solutions**:
1. Make sure your Airia pipelines are active/enabled
2. Check that you have credits/quota in your Airia account
3. Verify the pipeline output format

### Response format is different

**Issue**: Airia returns data in a different format than expected

**Solution**:
The code tries to extract `output` or `response` from the Airia result. You may need to update `airia_service.py` line 240 to match your Airia pipeline's output field:

```python
# Current code:
return result.get("output", result.get("response", str(result)))

# If your Airia pipeline returns different fields, update this!
# For example, if it returns "result":
return result.get("result", result.get("output", str(result)))
```

### Want to switch back to custom orchestration?

Just set in `.env`:
```env
USE_AIRIA_ORCHESTRATION=false
```

And restart the server!

---

## Monitoring

When Airia is enabled, you can:

1. **View pipeline executions** in your Airia dashboard
2. **Monitor costs** per agent execution
3. **See execution logs** for debugging
4. **Modify agent prompts** without touching code

---

## Next Steps

Once Airia is working:

1. ✅ **Test extensively** - Make sure responses are good quality
2. ✅ **Monitor costs** - Check Airia usage
3. ✅ **Tune prompts** - Adjust agent instructions in Airia dashboard
4. ✅ **Create workflows** - Use Airia's workflow builder for complex scenarios

---

## What if Airia Doesn't Work?

No problem! The system is **designed to work both ways**:

- ✅ **With Airia**: Professional agent management (`USE_AIRIA_ORCHESTRATION=true`)
- ✅ **Without Airia**: Direct OpenAI calls (`USE_AIRIA_ORCHESTRATION=false`)

Both give you the full 5-phase discussion with deliberation rounds. Airia just adds the professional orchestration layer on top.

---

## Support

If you encounter issues:

1. Check backend console logs for detailed errors
2. Verify all environment variables are set
3. Test Airia pipelines directly (see Testing section)
4. Set `USE_AIRIA_ORCHESTRATION=false` to use custom orchestration as fallback

**Your agents are configured and ready to go!** 🚀
