import runtimeMetadata from '@/lib/runtime-metadata.json';

const iframeTitle = "Wedding Invitation";
const iframeSrc = "/_mirror/saiyam-jenny.invitationmedia.in/index.html";

export default function RuntimePreserveShell() {
  return (
    <main className="runtime-preserve-shell" data-runtime-mode={runtimeMetadata.runtime.mode}>
      <iframe
        src={iframeSrc}
        title={iframeTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gamepad; gyroscope; picture-in-picture; web-share; xr-spatial-tracking"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </main>
  );
}
