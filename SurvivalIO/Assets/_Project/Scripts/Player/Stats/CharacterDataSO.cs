using UnityEngine;
using SurvivalIO.Weapons;

namespace SurvivalIO.Player
{
    /// <summary>
    /// ScriptableObject defining character starting attributes and default weapon.
    /// </summary>
    [CreateAssetMenu(fileName = "NewCharacterData", menuName = "SurvivalIO/Data/Character Data")]
    public class CharacterDataSO : ScriptableObject
    {
        [Header("Identity")]
        [SerializeField] private string _id;
        [SerializeField] private string _characterName;
        [TextArea(2, 4)]
        [SerializeField] private string _description;
        [SerializeField] private Sprite _portrait;
        [SerializeField] private GameObject _prefab;

        [Header("Starting Stats")]
        [SerializeField] private float _baseHealth = 100f;
        [SerializeField] private float _baseSpeed = 5f;
        [SerializeField] private float _baseArmor = 0f;
        [SerializeField] private float _pickupRange = 2.5f;

        [Header("Starting Equipment")]
        [SerializeField] private WeaponDataSO _startingWeapon;

        public string Id => _id;
        public string CharacterName => _characterName;
        public string Description => _description;
        public Sprite Portrait => _portrait;
        public GameObject Prefab => _prefab;
        public float BaseHealth => _baseHealth;
        public float BaseSpeed => _baseSpeed;
        public float BaseArmor => _baseArmor;
        public float PickupRange => _pickupRange;
        public WeaponDataSO StartingWeapon => _startingWeapon;
    }
}

