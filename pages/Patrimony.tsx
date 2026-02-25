
import React, { useState, useEffect } from 'react';
import { useAuth } from '../authContext';
import { ChurchAsset, UserRole } from '../types';
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Filter,
  BarChart3,
  Box,
  Tag,
  AlertCircle,
  Eye,
  Calendar,
  DollarSign,
  ClipboardList
} from 'lucide-react';

const Patrimony: React.FC = () => {
  const { user, theme, addNotification } = useAuth();
  const [assets, setAssets] = useState<ChurchAsset[]>(() => {
    const saved = localStorage.getItem('iesa_assets');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Conjunto de Cadeiras Plásticas', description: 'Cadeiras brancas para o templo principal', category: 'Mobiliário', quantity: 150, acquisitionDate: '2023-01-10', value: 750000, condition: 'BOM' },
      { id: '2', name: 'Sistema de Som Yamaha', description: 'Mixer e 4 colunas ativas', category: 'Equipamento de Som', quantity: 1, acquisitionDate: '2022-11-15', value: 2400000, condition: 'NOVO' }
    ];
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<ChurchAsset | null>(null);
  const [editingAsset, setEditingAsset] = useState<ChurchAsset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [assetFormData, setAssetFormData] = useState<Partial<ChurchAsset>>({
    name: '',
    description: '',
    category: 'Mobiliário',
    quantity: 1,
    acquisitionDate: new Date().toISOString().split('T')[0],
    value: 0,
    condition: 'NOVO'
  });

  useEffect(() => {
    localStorage.setItem('iesa_assets', JSON.stringify(assets));
  }, [assets]);

  const handleOpenAdd = () => {
    setEditingAsset(null);
    setAssetFormData({
      name: '',
      description: '',
      category: 'Mobiliário',
      quantity: 1,
      acquisitionDate: new Date().toISOString().split('T')[0],
      value: 0,
      condition: 'NOVO'
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (asset: ChurchAsset) => {
    setEditingAsset(asset);
    setAssetFormData({ ...asset });
    setShowFormModal(true);
  };

  const handleOpenView = (asset: ChurchAsset) => {
    setViewingAsset(asset);
    setShowViewModal(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetFormData.name || !assetFormData.quantity) return;

    if (editingAsset) {
      // Atualizar existente
      const updatedAssets = assets.map(a => 
        a.id === editingAsset.id ? { ...a, ...assetFormData } as ChurchAsset : a
      );
      setAssets(updatedAssets);
      addNotification(`Património: Item atualizado - ${assetFormData.name}`, user?.name || 'Assistente');
    } else {
      // Criar novo
      const asset: ChurchAsset = {
        id: Math.random().toString(36).substr(2, 9),
        name: assetFormData.name!,
        description: assetFormData.description || '',
        category: assetFormData.category || 'Outros',
        quantity: Number(assetFormData.quantity),
        acquisitionDate: assetFormData.acquisitionDate || new Date().toISOString().split('T')[0],
        value: Number(assetFormData.value || 0),
        condition: (assetFormData.condition as any) || 'NOVO'
      };
      setAssets([asset, ...assets]);
      addNotification(`Património: Novo item cadastrado - ${asset.name}`, user?.name || 'Assistente');
    }

    setShowFormModal(false);
  };

  const removeAsset = (id: string) => {
    if (confirm("Tem certeza que deseja remover este item do património?")) {
      setAssets(assets.filter(a => a.id !== id));
      addNotification(`Património: Item removido do sistema`, user?.name || 'Administrador');
    }
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = assets.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-red-600'}`}>Gestão de Património</h2>
          <p className="text-slate-500 font-medium">Controlo e inventário de bens patrimoniais da IESA.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-red-700 transition-all"
        >
          <Plus size={20} /> Cadastrar Património
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-sm'}`}>
           <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl"><Package size={24}/></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Total de Itens</p>
                <p className="text-2xl font-black">{assets.length}</p>
              </div>
           </div>
        </div>
        <div className={`p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-sm'}`}>
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><BarChart3 size={24}/></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Valor Estimado</p>
                <p className="text-2xl font-black">{totalValue.toLocaleString()} <span className="text-xs">AOA</span></p>
              </div>
           </div>
        </div>
        <div className={`p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-sm'}`}>
           <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Tag size={24}/></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Categorias</p>
                <p className="text-2xl font-black">{new Set(assets.map(a => a.category)).size}</p>
              </div>
           </div>
        </div>
      </div>

      <div className={`p-8 rounded-[2.5rem] border overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Pesquisar no inventário..." 
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none font-bold text-sm focus:ring-2 focus:ring-red-500 ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-transparent shadow-inner'}`}
              />
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black uppercase text-slate-400">Filtro Rápido:</span>
               {['Som', 'Mobiliário', 'Informática'].map(c => (
                 <button key={c} onClick={() => setSearchTerm(c)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">{c}</button>
               ))}
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className={`text-[10px] font-black uppercase tracking-widest border-b ${theme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-slate-50 text-slate-400'}`}>
                  <tr>
                    <th className="px-8 py-5">Item / Património</th>
                    <th className="px-8 py-5">Categoria</th>
                    <th className="px-8 py-5">Qtd.</th>
                    <th className="px-8 py-5">Estado</th>
                    <th className="px-8 py-5">Valor Aquis.</th>
                    <th className="px-8 py-5 text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredAssets.map(asset => (
                    <tr key={asset.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
                                <Box size={20}/>
                             </div>
                             <div>
                                <p className={`font-black text-sm uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{asset.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{asset.acquisitionDate}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-xs font-black uppercase text-slate-500">{asset.category}</td>
                       <td className="px-8 py-6 text-xs font-black text-slate-700 dark:text-slate-300">{asset.quantity}</td>
                       <td className="px-8 py-6">
                          <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${asset.condition === 'NOVO' ? 'bg-emerald-100 text-emerald-700' : asset.condition === 'BOM' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                             {asset.condition}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-sm font-black text-slate-800 dark:text-slate-100">{asset.value.toLocaleString()} AOA</td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-1">
                             <button 
                                onClick={() => handleOpenView(asset)}
                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                                title="Ver Detalhes"
                             >
                                <Eye size={18}/>
                             </button>
                             <button 
                                onClick={() => handleOpenEdit(asset)}
                                className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                                title="Editar Item"
                             >
                                <Edit3 size={18}/>
                             </button>
                             <button 
                                onClick={() => removeAsset(asset.id)}
                                className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                title="Remover Item"
                             >
                                <Trash2 size={18}/>
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
            {filteredAssets.length === 0 && (
              <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4 font-black uppercase text-xs">
                 <Package size={48}/> Nenhuma correspondência no inventário
              </div>
            )}
         </div>
      </div>

      {/* Modal de Formulário (Add/Edit) */}
      {showFormModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className={`w-full max-w-xl rounded-[3rem] shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
              <form onSubmit={handleSaveAsset} className="p-8 md:p-12 space-y-8">
                 <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`text-3xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {editingAsset ? 'Editar Património' : 'Novo Item Patrimonial'}
                      </h3>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Registo oficial de bens da Igreja</p>
                    </div>
                    <button type="button" onClick={() => setShowFormModal(false)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:bg-slate-100 transition-all">
                       <X size={24} />
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome do Item *</label>
                       <input 
                         type="text" required value={assetFormData.name} onChange={e => setAssetFormData({...assetFormData, name: e.target.value})}
                         className={`w-full p-4 rounded-2xl border font-bold outline-none focus:ring-2 focus:ring-red-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}
                         placeholder="Ex: Projetor Epson X41"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoria</label>
                        <select value={assetFormData.category} onChange={e => setAssetFormData({...assetFormData, category: e.target.value})} className={`w-full p-4 rounded-2xl border font-bold outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}>
                           <option value="Mobiliário">Mobiliário</option>
                           <option value="Som">Equipamento de Som</option>
                           <option value="Vídeo">Equipamento de Vídeo</option>
                           <option value="Informática">Informática</option>
                           <option value="Instrumentos">Instrumentos Musicais</option>
                           <option value="Outros">Outros</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Quantidade *</label>
                        <input type="number" required value={assetFormData.quantity} onChange={e => setAssetFormData({...assetFormData, quantity: Number(e.target.value)})} className={`w-full p-4 rounded-2xl border font-bold outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Valor Unitário (AOA)</label>
                        <input type="number" value={assetFormData.value} onChange={e => setAssetFormData({...assetFormData, value: Number(e.target.value)})} className={`w-full p-4 rounded-2xl border font-bold outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Estado de Conservação</label>
                        <select value={assetFormData.condition} onChange={e => setAssetFormData({...assetFormData, condition: e.target.value as any})} className={`w-full p-4 rounded-2xl border font-bold outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}>
                           <option value="NOVO">Novo</option>
                           <option value="BOM">Bom Estado</option>
                           <option value="USADO">Usado</option>
                           <option value="DANIFICADO">Danificado</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição / Localização</label>
                       <textarea value={assetFormData.description} onChange={e => setAssetFormData({...assetFormData, description: e.target.value})} className={`w-full p-4 rounded-2xl border font-bold outline-none resize-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} rows={2} placeholder="Onde o item está localizado?"></textarea>
                    </div>
                 </div>

                 <div className="pt-6">
                    <button type="submit" className="w-full bg-red-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 shadow-2xl transition-all flex items-center justify-center gap-3">
                      <Save size={20} /> {editingAsset ? 'Atualizar Património' : 'Guardar Património'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Modal de Detalhes (View) */}
      {showViewModal && viewingAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className={`w-full max-w-2xl rounded-[3rem] shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
              <div className="p-10 md:p-14 space-y-10">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 bg-red-600 text-white rounded-3xl flex items-center justify-center shadow-2xl">
                          <Package size={32}/>
                       </div>
                       <div>
                          <h3 className={`text-3xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{viewingAsset.name}</h3>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">{viewingAsset.category}</span>
                       </div>
                    </div>
                    <button onClick={() => setShowViewModal(false)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:bg-slate-100 transition-all">
                       <X size={24} />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex items-center gap-4 mb-1 text-slate-400">
                          <ClipboardList size={16}/>
                          <span className="text-[10px] font-black uppercase tracking-widest">Estado e Quantidade</span>
                       </div>
                       <p className={`text-lg font-black mt-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                          {viewingAsset.condition} • {viewingAsset.quantity} Unidades
                       </p>
                    </div>

                    <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex items-center gap-4 mb-1 text-slate-400">
                          <DollarSign size={16}/>
                          <span className="text-[10px] font-black uppercase tracking-widest">Valor de Inventário</span>
                       </div>
                       <p className={`text-lg font-black mt-2 text-emerald-600`}>
                          {viewingAsset.value.toLocaleString()} AOA
                       </p>
                    </div>

                    <div className={`p-6 rounded-3xl border md:col-span-2 ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex items-center gap-4 mb-1 text-slate-400">
                          <Calendar size={16}/>
                          <span className="text-[10px] font-black uppercase tracking-widest">Aquisição e Observações</span>
                       </div>
                       <p className={`text-xs font-bold text-slate-500 uppercase tracking-widest mt-1`}>
                          Data de Registo: {viewingAsset.acquisitionDate}
                       </p>
                       <p className={`mt-4 text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          {viewingAsset.description || "Nenhuma descrição adicional detalhada para este item."}
                       </p>
                    </div>
                 </div>

                 <div className="pt-4 flex gap-4">
                    <button 
                       onClick={() => { setShowViewModal(false); handleOpenEdit(viewingAsset); }}
                       className="flex-1 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                       <Edit3 size={18}/> Editar Registro
                    </button>
                    <button 
                       onClick={() => setShowViewModal(false)}
                       className="px-10 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                       Fechar
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Patrimony;
