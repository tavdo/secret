import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from './Modal.jsx';
import { RichTextBioEditor } from './RichTextBioEditor.jsx';
import { DraggableGallery } from './DraggableGallery.jsx';
import { MediaUploader } from './MediaUploader.jsx';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { useAdminToast } from '../context/ToastContext.jsx';

const defaults = () => ({
  displayName: '',
  handle: '',
  email: '',
  password: '',
  age: 26,
  city: 'Batumi',
  bio: '',
  servicesText: '',
  hourlyRate: 750,
  vip: false,
  available: true,
  hidden: false,
  featured: false,
  avatar: '',
  gallery: [],
});

function sliceFromEditing(editing) {
  if (!editing) return defaults();
  return {
    displayName: editing.displayName,
    handle: editing.handle,
    email: editing.email || '',
    password: '',
    age: editing.age,
    city: editing.city || 'Batumi',
    bio: editing.bio,
    servicesText: editing.servicesText || '',
    hourlyRate: editing.hourlyRate,
    vip: editing.vip,
    available: editing.available,
    hidden: editing.hidden,
    featured: editing.featured,
    avatar: editing.avatar ?? '',
    gallery: [...(editing.gallery ?? [])],
  };
}

export function ProfileFormModal({ open, onClose, editing }) {
  const isEdit = Boolean(editing);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={isEdit ? 'პროფილის რედაქტირება' : 'პროფილის დამატება'}
      subtitle="ქმნის ან განაახლებს პროვაიდერის განცხადებას ბაზაში."
    >
      {open ? (
        <ProfileFormBody key={editing?.id ?? 'create'} editing={editing} onClose={onClose} />
      ) : null}
    </Modal>
  );
}

function ProfileFormBody({ editing, onClose }) {
  const isEdit = Boolean(editing);
  const [form, setForm] = useState(() => sliceFromEditing(editing));
  const [busy, setBusy] = useState(false);
  const { addProfile, updateProfile, addMedia } = useAdminData();
  const { toast } = useAdminToast();

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const save = async () => {
    if (!form.displayName.trim()) {
      toast({ title: 'სახელი სავალდებულოა', variant: 'danger' });
      return;
    }
    if (!form.city.trim()) {
      toast({ title: 'ქალაქი სავალდებულოა', variant: 'danger' });
      return;
    }
    setBusy(true);
    try {
      if (isEdit) {
        const before = new Set(editing.gallery || []);
        await updateProfile(editing.id, {
          displayName: form.displayName,
          handle: form.handle,
          age: form.age,
          city: form.city,
          bio: form.bio,
          servicesText: form.servicesText,
          hourlyRate: form.hourlyRate,
          vip: form.vip,
          available: form.available,
          hidden: form.hidden,
          featured: form.featured,
          avatar: form.avatar,
          gallery: form.gallery,
        });
        (form.gallery || []).forEach((u) => {
          if (!before.has(u))
            addMedia({ url: u, profileId: editing.id, label: `${form.displayName} carousel` });
        });
        toast({ title: 'პროფილი განახლდა', variant: 'success' });
      } else {
        const nid = await addProfile(form);
        (form.gallery || []).forEach((u) =>
          addMedia({ url: u, profileId: nid, label: `${form.displayName} carousel` })
        );
        toast({ title: 'პროფილი შეიქმნა', variant: 'success' });
      }
      onClose?.();
    } catch (err) {
      toast({
        title: err?.response?.data?.error || err?.message || 'შენახვა ვერ მოხერხდა',
        variant: 'danger',
      });
    } finally {
      setBusy(false);
    }
  };

  const attachImage = (url) => {
    if (!url) return;
    setForm((prev) => ({
      ...prev,
      avatar: prev.avatar || url,
      gallery: [...prev.gallery, url],
    }));
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_minmax(0,0.95fr)]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="სახელი">
              <input
                className={inputCls}
                value={form.displayName}
                onChange={(e) => set({ displayName: e.target.value })}
              />
            </Field>
            <Field label="ჰენდლი / slug">
              <input
                className={inputCls}
                placeholder="@handle"
                value={form.handle}
                onChange={(e) => set({ handle: e.target.value })}
              />
            </Field>
            {!isEdit ? (
              <>
                <Field label="ელფოსტა (არასავალდებულო)">
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="ცარიელზე ავტომატურად შეიქმნება"
                    value={form.email}
                    onChange={(e) => set({ email: e.target.value })}
                  />
                </Field>
                <Field label="დროებითი პაროლი (არასავალდებულო)">
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="ცარიელზე ავტომატურად შეიქმნება"
                    value={form.password}
                    onChange={(e) => set({ password: e.target.value })}
                  />
                </Field>
              </>
            ) : (
              <Field label="მიბმული ელფოსტა">
                <input className={inputCls} value={form.email} disabled />
              </Field>
            )}
            <Field label="ასაკი">
              <input
                type="number"
                min={18}
                className={inputCls}
                value={form.age}
                onChange={(e) => set({ age: Number(e.target.value) || 18 })}
              />
            </Field>
            <Field label="ქალაქი">
              <select
                className={inputCls}
                value={form.city || 'Batumi'}
                onChange={(e) => set({ city: e.target.value })}
              >
                <option value="Batumi">ბათუმი</option>
              </select>
            </Field>
          </div>
          <Field label="საათობრივი ტარიფი (USD)">
            <input
              type="number"
              step={50}
              className={inputCls}
              value={form.hourlyRate}
              onChange={(e) => set({ hourlyRate: Number(e.target.value) || 0 })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <Toggle label="VIP" checked={form.vip} onChange={(v) => set({ vip: v })} />
            <Toggle label="ხელმისაწვდომი" checked={form.available} onChange={(v) => set({ available: v })} />
            <Toggle label="დამალული" checked={form.hidden} onChange={(v) => set({ hidden: v })} />
            <Toggle label="მთავარ გვერდზე" checked={form.featured} onChange={(v) => set({ featured: v })} />
          </div>

          <Field label="შეთავაზებული სერვისები (თითო ხაზზე ან მძიმით)">
            <textarea
              className={`${inputCls} min-h-[110px] resize-y`}
              placeholder="ვახშამი, მოგზაურობის თანმხლები, პირადი ღონისძიებები…"
              value={form.servicesText}
              onChange={(e) => set({ servicesText: e.target.value })}
            />
          </Field>

          <Field label="ბიოგრაფია">
            <RichTextBioEditor value={form.bio} onChange={(html) => set({ bio: html })} />
          </Field>
        </div>

        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">ფოტო და კარუსელი</p>
          <MediaUploader compact onUploaded={attachImage} />
          {form.avatar ? (
            <div className="rounded-xl overflow-hidden border border-white/10 max-h-52">
              <img src={form.avatar} alt="" className="w-full object-cover max-h-52" />
            </div>
          ) : null}
          <p className="text-xs text-zinc-500">Drag tiles to reorder. First upload becomes hero if portrait empty.</p>
          <DraggableGallery
            urls={form.gallery}
            onReorder={(from, to) => {
              setForm((prev) => {
                const g = [...prev.gallery];
                const [mv] = g.splice(from, 1);
                g.splice(to, 0, mv);
                return { ...prev, gallery: g };
              });
            }}
            onRemove={(idx) => {
              setForm((prev) => ({
                ...prev,
                gallery: prev.gallery.filter((_, i) => i !== idx),
              }));
            }}
          />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-6">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          disabled={busy}
          className="rounded-xl border border-white/12 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white disabled:opacity-50"
        >
          Cancel
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={save}
          disabled={busy}
          className="rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/90 to-yellow-700/85 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-black disabled:opacity-60"
        >
          {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create profile'}
        </motion.button>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={`flex-1 min-w-[140px] rounded-xl border px-3 py-2 text-left text-[11px] uppercase tracking-[0.15em] transition-colors ${
        checked ? 'border-amber-400/45 bg-amber-500/10 text-amber-50' : 'border-white/10 text-zinc-500'
      }`}
    >
      {label}
      <span className="float-right">{checked ? 'ON' : 'OFF'}</span>
    </button>
  );
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-sm outline-none focus:border-amber-400/40 disabled:opacity-60';
