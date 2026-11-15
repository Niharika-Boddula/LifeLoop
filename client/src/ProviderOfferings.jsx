import { useState } from 'react';
import { ArrowRight, PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { api } from './api';

const blank = { name: '', kind: 'service', description: '', price: '' };

export default function ProviderOfferings({ products, setProducts, notify, refreshListings }) {
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (key, value) => setForm(current => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true); setError('');
    const body = { name: form.name.trim(), kind: form.kind, description: form.description.trim(), currency: 'INR', price: form.price === '' ? null : Number(form.price) };
    try {
      const { data } = form._id ? await api.put(`/products/${form._id}`, body) : await api.post('/products', body);
      setProducts(current => form._id ? current.map(item => item._id === form._id ? data.product : item) : [data.product, ...current]);
      await refreshListings?.();
      setForm(blank); notify(form._id ? 'Offering updated' : 'Offering added to your public listing');
    } catch (err) { setError(err.response?.data?.message || 'Could not save this offering.'); }
    finally { setSaving(false); }
  }

  async function remove(item) {
    try { await api.delete(`/products/${item._id}`); setProducts(current => current.filter(row => row._id !== item._id)); await refreshListings?.(); notify('Offering removed'); }
    catch (err) { notify(err.response?.data?.message || 'Could not remove offering'); }
  }

  async function updateAvailability(item, availability) {
    try { const { data } = await api.put(`/products/${item._id}`, { availability }); setProducts(current => current.map(row => row._id === item._id ? data.product : row)); await refreshListings?.(); }
    catch (err) { notify(err.response?.data?.message || 'Could not update availability'); }
  }

  return <div className="provider-offerings">
    <div className="offerings-intro"><span className="offerings-icon"><PackagePlus size={20}/></span><div><strong>Tell customers what you offer</strong><p>Add services or products, set a price in rupees, and describe what’s included. These appear on your customer-facing listing.</p></div></div>
    <form className="offer-editor" onSubmit={submit}>
      <h3>{form._id ? 'Edit offering' : 'Add a service or product'}</h3>
      <label>What do you offer?<input required maxLength="120" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Blouse stitching, alterations"/></label>
      <div className="form-pair"><label>Type<select value={form.kind} onChange={e=>set('kind',e.target.value)}><option value="service">Service</option><option value="product">Product</option></select></label><label>Price (₹)<input type="number" min="0" step="1" value={form.price} onChange={e=>set('price',e.target.value)} placeholder="Leave blank for quote"/></label></div>
      <label>Description<textarea maxLength="1000" value={form.description} onChange={e=>set('description',e.target.value)} placeholder="What’s included? Mention any important details."/></label>
      {error&&<p className="form-error">{error}</p>}
      <div className="offer-editor-actions"><button className="btn btn-dark" disabled={saving}>{saving?'Saving…':form._id?'Save changes':'Add to my listing'} <ArrowRight size={15}/></button>{form._id&&<button type="button" className="text-link" onClick={()=>{setForm(blank);setError('')}}>Cancel edit</button>}</div>
    </form>
    <div className="provider-offer-list"><h3>Your customer-facing offers <span>{products.length}</span></h3>
      {products.length ? products.map(item=><article className="provider-offer-row" key={item._id}><div className="provider-offer-copy"><span className="eyebrow">{item.kind==='service'?'SERVICE':'PRODUCT'}</span><strong>{item.name}</strong><small>{item.price!=null?`₹${item.price}`:'Price by quote'}{item.description?` · ${item.description}`:''}</small></div><select aria-label={`Availability for ${item.name}`} value={item.availability||'unknown'} onChange={e=>updateAvailability(item,e.target.value)}><option value="unknown">Availability unknown</option><option value="available">Available</option><option value="unavailable">Unavailable</option><option value="in_stock">In stock</option><option value="out_of_stock">Out of stock</option></select><button aria-label={`Edit ${item.name}`} onClick={()=>{setForm({_id:item._id,name:item.name,kind:item.kind||'service',description:item.description||'',price:item.price??''});setError('')}}><Pencil size={15}/></button><button aria-label={`Remove ${item.name}`} onClick={()=>remove(item)}><Trash2 size={15}/></button></article>) : <p className="section-empty">No offers yet. Add one above so customers can see your services and prices.</p>}
    </div>
  </div>;
}
