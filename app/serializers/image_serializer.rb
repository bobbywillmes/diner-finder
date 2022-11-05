class ImageSerializer < ActiveModel::Serializer
  attributes :id

  def url
    if object.image.attached?
      {
        url: rails_blob_url(object.image)
      }
    end
  end

end
