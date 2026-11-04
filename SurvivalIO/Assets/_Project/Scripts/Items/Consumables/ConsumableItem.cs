using UnityEngine;

namespace SurvivalIO.Items
{
    /// <summary>
    /// Component representing immediate-use consumables such as potions and chest rewards.
    /// </summary>
    public class ConsumableItem : MonoBehaviour
    {
        [SerializeField] private ItemType _type;
        [SerializeField] private float _amount = 25f;

        public ItemType Type => _type;
        public float Amount => _amount;
    }
}

