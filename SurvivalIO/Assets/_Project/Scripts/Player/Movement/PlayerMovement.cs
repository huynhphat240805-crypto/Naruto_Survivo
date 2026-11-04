using UnityEngine;

namespace SurvivalIO.Player
{
    /// <summary>
    /// Applies 2D kinematic / physics velocity to the player character based on input and stats.
    /// </summary>
    [RequireComponent(typeof(Rigidbody2D))]
    public class PlayerMovement : MonoBehaviour
    {
        [SerializeField] private Rigidbody2D _rigidbody2D;
        [SerializeField] private PlayerInputHandler _inputHandler;
        [SerializeField] private PlayerStats _stats;

        public Vector2 LastFacingDirection { get; private set; } = Vector2.right;

        private void Awake()
        {
            if (_rigidbody2D == null) _rigidbody2D = GetComponent<Rigidbody2D>();
            if (_inputHandler == null) _inputHandler = GetComponent<PlayerInputHandler>();
            if (_stats == null) _stats = GetComponent<PlayerStats>();
        }

        private void FixedUpdate()
        {
            if (_inputHandler == null) return;

            Vector2 input = _inputHandler.MoveInput;
            float speed = _stats != null ? _stats.MoveSpeed : 5f;

            _rigidbody2D.linearVelocity = input * speed;

            if (input.sqrMagnitude > 0.01f)
            {
                LastFacingDirection = input;
                // Flip sprite scale depending on horizontal direction
                if (Mathf.Abs(input.x) > 0.05f)
                {
                    Vector3 scale = transform.localScale;
                    scale.x = input.x > 0 ? Mathf.Abs(scale.x) : -Mathf.Abs(scale.x);
                    transform.localScale = scale;
                }
            }
        }
    }
}

