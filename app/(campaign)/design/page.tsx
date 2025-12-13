import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const DesignPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">DESIGN EMAIL TEMPLATE</h2>
        <p className="text-muted-foreground text-sm">
          Create your subject and email body. Use available columns from your Contacts Table for personalization.
        </p>
      </div>

      <div className="gap-8">
        {/* Main Editor */}
        <div className="border border-border">
          <div className="p-8 space-y-8">
            {/* Subject Line */}
            <div>
              <label className="block text-xs font-black tracking-widest mb-3">SUBJECT</label>
              <Input
                type="text"
                placeholder="Requesting Sponsorship for Hackathon"
              />
            </div>

            {/* Email Body */}
            <div>
              <label className="block text-xs font-black tracking-widest mb-3">EMAIL BODY (HTML SUPPORTED)</label>
              <div className="relative">
                <Textarea
                  placeholder={`<p>Hi {name},</p>\n\n<p>We'd love to offer you an exclusive deal.</p>\n\n<p>Best regards,<br>Team</p>`}
                  className="min-h-64"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Start typing &#123; to see available columns. HTML tags are supported.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DesignPage