class ImageSerializer < ActiveModel::Serializer
  attributes :id
  belongs_to :review

  def url
    if object.image.attached?
      {
        url: rails_blob_url(object.image)
      }
    end
  end

end
