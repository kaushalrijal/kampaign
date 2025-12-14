import { Label } from '@/components/ui/label'

const ConfigurePage = () => {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">CAMPAIGN CONFIGURATION</h2>
        <p className="text-muted-foreground text-sm">
          Review your campaign settings before sending. Test SMTP connection below.
        </p>
      </div>

      {/* Campaign Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border p-6 bg-card">
          <Label>RECIPIENTS</Label>
          <div className="text-4xl font-black">69</div>
          <div className="text-xs text-muted-foreground mt-2">emails to be sent</div>
        </div>

        <div className="border border-border p-6 bg-card">
          <Label>ATTACHMENTS</Label>
          <div className="text-4xl font-black">3</div>
          <div className="text-xs text-muted-foreground mt-2">files included</div>
        </div>

        <div className="border border-border p-6 bg-card">
          <Label>STATUS</Label>
          <div className="text-xl font-black text-primary">READY</div>
          <div className="text-xs text-muted-foreground mt-2">all systems go</div>
        </div>
      </div>
    </div>
  )
}

export default ConfigurePage