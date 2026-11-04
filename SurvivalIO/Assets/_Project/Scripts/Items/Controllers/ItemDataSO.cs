using UnityEngine;

namespace SurvivalIO.Items
{
    /// <summary>
    /// ScriptableObject defining static data and drop properties for items.
    /// </summary>
    [CreateAssetMenu(fileName = "NewItemData", menuName = "SurvivalIO/Data/Item Data")]
    public class ItemDataSO : ScriptableObject
    {
        [Header("Identity")]
        [SerializeField] private string _id;
        [SerializeField] private string _itemName;
        [TextArea(2, 4)]
        [SerializeField] private string _description;
        [SerializeField] private Sprite _icon;
        [SerializeField] private ItemType _itemType;

        [Header("Attributes")]
        [SerializeField] private float _value = 10f;
        [SerializeField] private GameObject _prefab;

        public string Id => _id;
        public string ItemName => _itemName;
        public string Description => _description;
        public Sprite Icon => _icon;
        public ItemType ItemType => _itemType;
        public float Value => _value;
        public GameObject Prefab => _prefab;
    }
}

