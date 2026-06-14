import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateRecipe } from './api';
import { supabase } from './supabaseClient';
import './ProductAdd.css';

export default function ProductAdd({ onLogout }) {
  const [activeModal, setActiveModal] = useState(null);
  const [products, setProducts] = useState([]);
  const [basics, setBasics] = useState(['Tuz', 'Yağ', 'Un', 'Salça', 'Baharat', 'Şeker']);
  const [newBasic, setNewBasic] = useState('');
  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiRecipe, setAiRecipe] = useState(null);
  const [recipeHistory, setRecipeHistory] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  
  // SEKTÖREL EKLENTİ: Anlık (Ad-hoc) malzeme state'leri
  const [instantIngredient, setInstantIngredient] = useState('');
  const [instantList, setInstantList] = useState([]);

  useEffect(() => { 
    fetchUserPantry(); 
    fetchUserRecipes();
  }, []);

  async function fetchUserPantry() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('user_pantries').select('id, expiration_date, global_ingredients(name)').eq('user_id', user.id);
      if (data) setProducts(data.map(item => ({ 
        id: item.id, 
        name: item.global_ingredients?.name || 'Bilinmeyen', 
        rawExpiryDate: item.expiration_date,
        expiryDate: item.expiration_date ? new Date(item.expiration_date).toLocaleDateString('tr-TR') : 'Belirtilmedi'
      })));
    } catch (err) { console.error(err); }
  }

  async function fetchUserRecipes() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('user_recipes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setRecipeHistory(data.map(item => ({
        id: item.id,
        name: item.recipe_name,
        content: item.recipe_content,
        note: item.co2_note
      })));
    } catch (err) { console.error(err); }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let { data: ingredient } = await supabase.from('global_ingredients').select('id').ilike('name', productName.trim()).single();
      if (!ingredient) {
        const { data: newIng } = await supabase.from('global_ingredients').insert([{ name: productName.trim() }]).select('id').single();
        ingredient = newIng;
      }
      await supabase.from('user_pantries').insert([{ user_id: user.id, global_ingredient_id: ingredient.id, expiration_date: expiryDate || null, quantity: 1, unit: 'adet' }]);
      await fetchUserPantry();
      setProductName(''); setActiveModal(null);
    } catch (err) { alert("Ekleme başarısız."); }
    setLoading(false);
  }

  async function handleSaveRecipe() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const extractedName = extractRecipeName(aiRecipe);
      const co2Match = aiRecipe.match(/(?:CO2[_ ]Tasarrufu|CO2 Tasarrufu):\s*(\d+(\.\d+)?)/i);
      const co2Value = co2Match ? co2Match[1] : "0.0";
      const dynamicNote = `🎉 ${co2Value} kg CO2 kurtardın!`;
      
      const { error } = await supabase.from('user_recipes').insert([{
        user_id: user.id,
        recipe_name: extractedName,
        recipe_content: aiRecipe,
        co2_note: dynamicNote
      }]);

      if (error) throw error;
      
      await fetchUserRecipes();
      closeModal();
    } catch (err) {
      alert("Tarif kaydedilirken veritabanı hatası oluştu.");
    }
  }

  async function handleDeleteRecipe(id, indexToDelete, e) {
    e.stopPropagation();
    try {
      if (id) {
        await supabase.from('user_recipes').delete().eq('id', id);
      }
      setRecipeHistory(recipeHistory.filter((_, index) => index !== indexToDelete));
      if (selectedRecipe && recipeHistory[indexToDelete]?.content === selectedRecipe.content) {
        setSelectedRecipe(null);
      }
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  }

  const removeBasic = (item) => setBasics(basics.filter(i => i !== item));

  const generateCo2Note = (itemCount) => {
    const co2 = itemCount > 0 ? (itemCount * 0.45).toFixed(1) : "0.0"; 
    const funOptions = [
       `🎉 ${co2} kg CO2 kurtardın! Bu, her gün bindiğin metrobüsün 3 durak boyunca tükettiği enerjiye eşit!`,
       `🚀 ${co2} kg CO2 cepte! Telefonunu tam ${(co2 * 122).toFixed(0)} kez şarj etsen ancak bu kadar karbon salınırdı.`,
       `🌲 Harika! ${co2} kg CO2 kurtararak mahalledeki yaşlı çınar ağacına tam ${(co2 * 16).toFixed(0)} günlük bir tatil hediye ettin.`,
       `🎬 ${co2} kg CO2 tasarrufu! Netflix'te hiç durmadan ${(co2 * 25).toFixed(0)} saat dizi izlemenin çevreye yükünü sıfırladın.`,
       `💡 İnanılmaz! Bu tasarrufla odandaki standart bir LED ampulü tam ${(co2 * 85).toFixed(0)} saat aralıksız yakabilirdin.`,
       `☕ Süper! Kurtardığın bu karbon miktarıyla bir kafede tam ${(co2 * 30).toFixed(0)} bardak filtre kahve demlenebilirdi.`,
       `🚗 Helal olsun! Benzinli bir arabayla trafiğe çıkıp ${(co2 * 3.5).toFixed(1)} km yol yapmanın yarattığı kirliliği sildin.`,
       `📱 Doğaya nefes! Bu oran, sosyal medyada aralıksız ${(co2 * 150).toFixed(0)} saat gezinmenin veri merkezi maliyetine eşdeğer!`
    ];
    return funOptions[Math.floor(Math.random() * funOptions.length)];
  };

  const isExpiringSoon = (rawDate) => {
    if (!rawDate) return false;
    const today = new Date();
    const expiry = new Date(rawDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 3 && daysDiff >= 0; 
  };

  const extractRecipeName = (markdownText) => {
    if (!markdownText) return "Özel Tarif";
    const nameMatch = markdownText.match(/\*\*Yemek Adı:\*\*\s*(.+)/i) || markdownText.match(/Yemek Adı:\s*(.+)/i);
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1].replace(/[*#]/g, '').trim();
    }
    const firstLine = markdownText.split('\n').find(line => line.trim().length > 0);
    return firstLine ? firstLine.replace(/[#*"]/g, '').trim() : "Sürdürülebilir Tarif";
  };

  // Kapatırken anlık listeyi de sıfırlıyoruz
  const closeModal = () => { 
    setActiveModal(null); setAiRecipe(null); setSelectedRecipe(null); 
    setSelectedProductIds([]); setNewBasic(''); setInstantIngredient(''); setInstantList([]); 
  };

  return (
    <main className="dashboard-container">
      {/* SADECE DEĞİŞEN KISIM: design-system.md standardına uygun tipografi tabanlı header */}
      <header className="brand-header">
        <h1 className="brand-title">
          <span style={{ color: '#10b981' }}>Son</span> Çağrı
        </h1>
        
        <div className="co2-badge">
          🌍 Toplam Tasarruf: {
            recipeHistory.reduce((total, recipe) => {
              const match = recipe.note ? recipe.note.match(/(\d+(\.\d+)?)\s*kg/) : null;
              return total + (match ? parseFloat(match[1]) : 0);
            }, 0).toFixed(1)
          } kg CO2
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="card" onClick={() => setActiveModal('kiler')}>🏠 Kilerim</div>
        <div className="card" onClick={() => setActiveModal('ekle')}>➕ Ürün Ekle</div>
        <div className="card" onClick={() => setActiveModal('envanter')}>📦 Envanterim</div>
        <div className="card" onClick={() => setActiveModal('tarif')}>🍳 Tarif Üret</div>
        <div className="card" onClick={() => setActiveModal('gecmis')}>📚 Tariflerim</div>
        <div className="card" onClick={() => setActiveModal('co2-detay')}>🌍 Karbon Etkisi</div>
        <div className="card-logout" onClick={onLogout}>Çıkış 🚪</div>
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>Kapat</button>
            <div className="modal-inner-content">
              
              {activeModal === 'kiler' && (
                <div><h2>Kilerim</h2>
                  {products.map(p => (
                    <div key={p.id} className="product-item" style={{borderLeft: isExpiringSoon(p.rawExpiryDate) ? '5px solid #ef4444' : '5px solid #10b981'}}>
                      <div>
                        <strong>{p.name}</strong> 
                        {isExpiringSoon(p.rawExpiryDate) && <span style={{color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem', marginLeft: '8px'}}>⚠️ SKT Yaklaştı!</span>}
                        <br/><small>STT: {p.expiryDate}</small>
                      </div>
                      <button onClick={async() => { await supabase.from('user_pantries').delete().eq('id', p.id); fetchUserPantry(); }} style={{background:'none', border:'none', cursor:'pointer'}}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'ekle' && (
                <form onSubmit={handleAddProduct}>
                  <h2>Yeni Ürün Ekle</h2>
                  <input className="premium-input" placeholder="Ürün Adı" value={productName} onChange={e => setProductName(e.target.value)} required />
                  <input className="premium-input" type="date" onChange={e => setExpiryDate(e.target.value)} />
                  <button className="submit-btn" type="submit">Ekle</button>
                </form>
              )}

              {activeModal === 'envanter' && (
                <div><h2>📦 Envanterim (Temel)</h2>
                  <div style={{display:'flex', gap:'5px', marginBottom:'15px'}}>
                    <input className="premium-input" style={{margin:0}} placeholder="Yeni temel malzeme..." value={newBasic} onChange={e => setNewBasic(e.target.value)} />
                    <button className="submit-btn" style={{width:'auto', margin:0, padding:'0 20px'}} onClick={() => { if(newBasic.trim()) { setBasics([...basics, newBasic.trim()]); setNewBasic(''); } }}>+</button>
                  </div>
                  <div className="basics-grid">
                    {basics.map(b => (
                      <div className="flashcard-mini" key={b} onClick={() => removeBasic(b)} style={{cursor:'pointer', border:'2px solid #10b981', display:'flex', justifyContent:'space-between'}}>
                        <span>{b}</span> <span>🗑️</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'tarif' && (
                <div><h2>Tarif Üret</h2>
                  {!aiRecipe ? (
                    <>
                      <div className="list-container">
                        <p><strong>Kilerimden Seç:</strong></p>
                        {products.map(p => (
                          <label key={p.id} style={{display:'block', padding:'5px', color: isExpiringSoon(p.rawExpiryDate) ? '#ef4444' : 'inherit'}}>
                            <input type="checkbox" onChange={(e) => e.target.checked ? setSelectedProductIds([...selectedProductIds, p]) : setSelectedProductIds(selectedProductIds.filter(id => id.id !== p.id))} /> {p.name} 
                            <small style={{color: isExpiringSoon(p.rawExpiryDate) ? '#ef4444' : '#64748b'}}> ({p.expiryDate})</small>
                            {isExpiringSoon(p.rawExpiryDate) && <span style={{fontWeight: 'bold', fontSize: '0.75rem', marginLeft: '5px'}}>⚠️</span>}
                          </label>
                        ))}
                      </div>

                      <div style={{marginTop: '15px', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                        <p style={{fontSize: '0.85rem', marginBottom: '8px', color: '#334155'}}><strong>💡 Anlık Ekle:</strong> Şu an kilerde olmayan ekstra bir malzemeniz var mı?</p>
                        <div style={{display: 'flex', gap: '5px'}}>
                          <input 
                            className="premium-input" 
                            style={{margin: 0, padding: '8px'}} 
                            placeholder="Örn: Yarım soğan..." 
                            value={instantIngredient} 
                            onChange={e => setInstantIngredient(e.target.value)} 
                            onKeyDown={(e) => { 
                              if(e.key === 'Enter') { 
                                e.preventDefault(); 
                                if(instantIngredient.trim()) { setInstantList([...instantList, instantIngredient.trim()]); setInstantIngredient(''); } 
                              } 
                            }} 
                          />
                          <button 
                            className="submit-btn" 
                            style={{width: 'auto', margin: 0, padding: '0 15px', background: '#3b82f6'}} 
                            onClick={(e) => { 
                              e.preventDefault();
                              if(instantIngredient.trim()) { setInstantList([...instantList, instantIngredient.trim()]); setInstantIngredient(''); } 
                            }}
                          >
                            Ekle
                          </button>
                        </div>
                        {instantList.length > 0 && (
                          <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px'}}>
                            {instantList.map((item, idx) => (
                              <span key={idx} style={{background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                {item} 
                                <span style={{cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setInstantList(instantList.filter((_, i) => i !== idx))}>×</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <p style={{fontSize:'0.85rem', color:'#64748b', marginTop:'15px'}}>* Envanterimdeki temel malzemeler tarife otomatik dahil edilecektir.</p>
                      
                      <button className="submit-btn" style={{marginTop:'10px'}} onClick={async () => { 
                        if (selectedProductIds.length === 0 && instantList.length === 0) {
                          alert("Lütfen kilerinizden veya anlık olarak en az bir ürün seçiniz.");
                          return;
                        }

                        setLoading(true); 
                        const sortedProducts = [...selectedProductIds].sort((a, b) => {
                          if (!a.rawExpiryDate) return 1;
                          if (!b.rawExpiryDate) return -1;
                          return new Date(a.rawExpiryDate) - new Date(b.rawExpiryDate);
                        });
                        
                        const ingredientPayload = [
                          ...sortedProducts.map(p => p.rawExpiryDate ? `${p.name} (STT: ${p.expiryDate})` : p.name),
                          ...instantList,
                          ...basics
                        ];

                        const res = await generateRecipe(ingredientPayload); 
                        setAiRecipe(res.recipe); 
                        setLoading(false); 
                      }}>
                        {loading ? "Üretiliyor..." : "Üret"}
                      </button>
                    </>
                  ) : (
                    <div>
                      <div className="recipe-content">
                        <ReactMarkdown>
                          {aiRecipe ? aiRecipe.replace(/\*\*Yemek Adı:\*\*\s*.*/i, '').trim() : ''}
                        </ReactMarkdown>
                      </div>
                      
                      <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                        <button className="submit-btn" style={{background: '#f59e0b', flex: 1}} onClick={async () => {
                          setLoading(true);
                          const sortedProducts = [...selectedProductIds].sort((a, b) => {
                            if (!a.rawExpiryDate) return 1;
                            if (!b.rawExpiryDate) return -1;
                            return new Date(a.rawExpiryDate) - new Date(b.rawExpiryDate);
                          });
                          const ingredientPayload = [...sortedProducts.map(p => p.rawExpiryDate ? `${p.name} (STT: ${p.expiryDate})` : p.name), ...instantList, ...basics];
                          const res = await generateRecipe(ingredientPayload);
                          setAiRecipe(res.recipe);
                          setLoading(false);
                        }}>
                          🔄 Başka Tarif
                        </button>

                        <button className="submit-btn" style={{flex: 1}} onClick={handleSaveRecipe}>✅ Kaydet</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeModal === 'gecmis' && (
                <div><h2>Tariflerim</h2>
                  {!selectedRecipe ? recipeHistory.map((h, i) => (
                    <div key={i} className="flashcard" onClick={() => setSelectedRecipe(h)} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span>{h.name}</span>
                      <button onClick={(e) => handleDeleteRecipe(h.id, i, e)} style={{background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer'}}>🗑️</button>
                    </div>
                  ))
                  : <div className="recipe-result">
                      <h3>{selectedRecipe.name}</h3>
                      <div className="recipe-content">
                        <ReactMarkdown>{selectedRecipe.content ? selectedRecipe.content.replace(/\*\*Yemek Adı:\*\*\s*.*/i, '').trim() : ''}</ReactMarkdown>
                      </div>
                      <button className="submit-btn" style={{marginTop:'15px'}} onClick={() => setSelectedRecipe(null)}>Geri</button>
                    </div>}
                </div>
              )}

              {activeModal === 'co2-detay' && (
                <div><h2>Karbon Etkisi</h2>
                  {recipeHistory.map((h, i) => (
                    <div key={i} className="history-card" onClick={() => setSelectedRecipe(h)} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div style={{flex: 1, paddingRight: '10px'}}>
                        <strong>{h.name}</strong><br/>
                        <span className="co2-tag" style={{display:'inline-block', marginTop:'5px'}}>{h.note}</span>
                      </div>
                      <button onClick={(e) => handleDeleteRecipe(h.id, i, e)} style={{background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer'}}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </main>
  );
}
