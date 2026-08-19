import runtimeMetadata from '@/lib/runtime-metadata.json';

export default function EditableOverlay() {
  return (
    <aside aria-label="Runtime metadata">
      <dl>
        <div>
          <dt>Source</dt>
          <dd>{runtimeMetadata.sourceUrl}</dd>
        </div>
        <div>
          <dt>Runtime mode</dt>
          <dd>{runtimeMetadata.runtime.mode}</dd>
        </div>
        <div>
          <dt>Engines</dt>
          <dd>{runtimeMetadata.runtime.engines.join(', ') || 'Unknown'}</dd>
        </div>
      </dl>
    </aside>
  );
}
